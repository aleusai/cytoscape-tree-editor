import copy
from nx import to_client_convention, from_file_to_cy, classes as pc
from callbacks_helpers.create_node import create_node
import sys
import traceback
import json
from flask_session import Session
import _ctypes
from subprocess import check_output
import os
import re
from string import ascii_letters, digits
from random import choice

"""
Main callback functionalities (e.g. save or upload a configuration file) 
"""

"""
Helper functions
"""


def graph_append(g, session, index_flag=True) -> list:
    """
    :param g: Graph that will be appended to the list
    :return: cytoscape representation of the Networkx Graph g
    """

    if index_flag:
        session['graphs_list'].append(g)
        session['index'] = len(session['graphs_list']) - 1
    return g


def index_move(step, session) -> list:
    """
    :param step: the step (forward or rewind) that we want to take
    :return: cytoscape Graph
    """
    _ = session['index'] + step
    if _ > len(session['graphs_list']) - 1 or _ < 0:
        try:
            return session['graphs_list'][session['index']]
        except KeyError:
            return []
    try:
        session['index'] = _
        return session['graphs_list'][_]
    except KeyError:
        return []



def add_pipeline(data, session, g, pipeline_components=[]) -> list:
    """
    :param data: pipeline data 
    :param session: flask session
    :param g: initial Graph
    :param pipeline_components: list of the pipeline components
    """
    pipeline_components = pipeline_components if pipeline_components else \
        data[1]  # this is done as add_pipeline can be used by other functions
    pipeline_names = []
    if data and data[0]:
        pipeline_names = data[0]
    else:
        c = ''.join([choice(ascii_letters + digits) for i in range(6)])
        pipeline_names = [c]
    node_info = {}
    pattern = re.compile('<pipeline_name>')
    for i in pipeline_components:
        node_info['myjson'] = copy.deepcopy(session['defaults'][i])
        jdumps = json.dumps(node_info['myjson'])
        for pipeline_name in pipeline_names:
            new_pipeline_name = re.sub(r'([^a-zA-Z ]+?)', '', pipeline_name)
            name = None
            cleantext = re.sub(pattern, pipeline_name, jdumps)
            node_info['myjson'] = json.loads(cleantext)
            name = name if name else pipeline_name
            #tic0 = time.perf_counter()
            g = create_node(i, g, node_info['myjson'], name, session)
            #toc0 = time.perf_counter()
    return g


def delete_node(node_info, session) -> list:
    """
    It returns the list with the edited cytoscape elements
    parameter: node_info: node_info of the node that must be deleted
    parameter: session: socketio session
    """
    g = copy.deepcopy(session['graphs_list'][session['index']])
    try:
        for id_deleted in node_info:
            for index, value in enumerate(g['nodes']):
                if value['data']['id'] == str(id_deleted):
                    g['nodes'].pop(index)
                    break
            for key, value in session['parents_dict'].items():
                if value == id_deleted:
                    session['parents_dict'].pop(key)
            for index, value in enumerate(g['edges']):
                if (value['data']['id'] == str(id_deleted)):
                    g['edges'].pop(index)
                    break
    
    except:
        e = sys.exc_info()[0]
        print('Failed to delete node or edge, error: ', e)
        print('It may be a zeromq virtual graph, so it is ok')
    return graph_append(g, session, True)


def clone_node(node_info, session) -> list:
    """
    It returns the list with the edited cytoscape elements
    parameter: node_info: node_info of the node that must be deleted
    parameter: session: socketio session
    """
    id_edited_node = node_info['content'][0]
    node_type = node_info['content'][1]
    g = copy.deepcopy(session['graphs_list'][session['index']])
    node_json = {}
    node = {}

    if id_edited_node in session['parents_dict'].values():
        # We do not clone parent nodes
        return g
    for _ in g['nodes']:
        if (str(_['data']['id']) == str(id_edited_node)):
            node = copy.deepcopy(_)
            node_json = copy.deepcopy(_['data'][to_client_convention['node_json']]) if to_client_convention['node_json']in _['data'] else {}
    if not node:
        # we do nothing, could not find the node id in g
        # send back client error TBD
        return g
    if (("Node_Type" in node['data']) and node_json):
        if 'in_queue_url' in node_json:
            node_json['in_queue_url'] = 'cloned' + node_json['in_queue_url']
        if 'out_queue_url' in node_json:
            node_json['out_queue_url'] = 'cloned' + node_json['out_queue_url']
        g = create_node(str(node['data']['Node_Type']),
                        g, node_json, None, session)
    else:
        g = create_node(str(node['data']['Node_Type']), g, node_json, None, session)
    return graph_append(g, session, True)



def add_node(jsonblob, session) -> list:
    """
    parameter: jsonblob: node type that needs to be created
    parameter: session: socketio session
    """
    dropdown_value = jsonblob['content']
    g_ = session['graphs_list'][session['index']] if session['graphs_list'] and "index" in session else None
    g_ =copy.deepcopy(g_)  # important

    g = create_node(dropdown_value, g_, session['defaults'][dropdown_value], None, session)
    gret = graph_append(g, session, True)
    return gret


def edit_node(node_info, session) -> list:
    """
    It returns the cytoscape elements list with the edited node

    parameter: node_info: edited node_info of a node
    parameter: session: socketio session
    """
    g = copy.deepcopy(session['graphs_list'][session['index']])
    
    try:
        node_json = node_info[to_client_convention['node_json']]
        node_type = node_info['Node_Type']
        name = node_info['name']
        id_edited_node = node_info['id']
    except:
        e = sys.exc_info()[0]
        print('edit_node error ', e)
        return graph_append(g, session,  False), '', ''
    new_node = {}
    try:
        for node in g['nodes']:
            if str(node['data']['id']) == id_edited_node:
                if node_json:
                    node['data'][to_client_convention['node_json']] = copy.deepcopy(node_json)
                if name:
                    node['data']['name'] = copy.deepcopy(name)
                new_node = node
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        print(exc_type, fname, exc_tb.tb_lineno)

    ee = graph_append(g, session,  True)
    nxv = dict()
    nxv["data"] = dict()
    nxv["data"]["id"] = str(id_edited_node)
    nxv["data"]["Node_Type"] = new_node['data']['Node_Type'] if "Node_Type" in new_node['data'] else ''
    nxv["data"]["name"] = new_node['data']['name'] if "name" in new_node['data'] else ''
    nxv['classes'] = 'grey'
    if "children_type" in new_node:
        nxv['classes'] = 'green'
    if to_client_convention['node_json'] in new_node['data']:
        nxv["data"][to_client_convention['node_json']] = \
            new_node['data'][to_client_convention['node_json']]
        
    return ee, id_edited_node, nxv['data']



