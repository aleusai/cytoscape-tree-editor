#!/usr/bin/python3

from nx import classes as pc
import json
from string import ascii_letters, digits
from random import choice
import copy
import operator
from functools import reduce


def from_file_to_cy(
        classes_dict, session
) -> dict():
    """
    A (valid) json file is loaded and converted into a python dictionary.
    """
    if "parents_dict" not in session:
        session['parents_dict'] = {}

    g = {}
    g["nodes"] = []
    g["edges"] = []

    try:
        # We load the json file in a dictionary
        classes_dict = json.loads(classes_dict)
    except Exception as e:
        raise Exception
    
    # We start populating the graph, Root node
    root_node = 'root' + ''.join([choice(ascii_letters + digits) for i in range(6)])
    session['parents_dict']["root"] = root_node
    g['nodes'].append( { 
     'classes': 'red', 
     'parent': "root",
     'data': {'id' : root_node,
     'Node_Type': "root",
     'name': "root"
 } })


    # parent nodes and edges
    for p in classes_dict.keys():
        if  p + 'Parent' in session['defaults']:
            nestingPath = session['defaults'][p + 'Parent'][p + 'Parent']['depth'].split('.')
            parentData = copy.deepcopy(classes_dict[p])
            reduce(operator.getitem, nestingPath[:-1], parentData)[nestingPath[-1]] = []
        print('parentData:', parentData)
        id_parent = 'root_' + p + '_' + ''.join([choice(ascii_letters + digits) for i in range(6)]) 
        session['parents_dict'][p] = id_parent
        g['nodes'].append( { 
            'classes': 'red', 
            'parent': "root",
            'data': {'id':  id_parent,
            'Node_Type': p,
            'name': p,
            to_client_convention['node_json']: parentData
        } }) if  p + 'Parent' in session['defaults'] else g['nodes'].append( { 
            'classes': 'red', 
            'parent': "root",
            'data': {'id': id_parent,
            'Node_Type': p,
            'name': p
        } })
        g['edges'].append( {
            'classes': 'followerEdge',
            "data": {
            "id": str(root_node) + '-' + str(id_parent),
            "source": root_node,
            "target": session['parents_dict'][p] 
            }
        })



    # children nodes and edges
    for parent, children_list in classes_dict.items():
        for child_name, child in children_list.items():
            id = ''.join([choice(ascii_letters + digits) for i in range(6)])
            child_id = parent + '-' + id
            if  p + 'Parent' in session['defaults']:
                nestingPath = session['defaults'][p + 'Parent'][p + 'Parent']['depth'].split('.')
                parentJson = classes_dict[parent]

                for _ in reduce(operator.getitem, nestingPath, parentJson):
                    id = ''.join([choice(ascii_letters + digits) for i in range(6)])
                    child_id = parent + '-' + id
                    g['nodes'].append( { 
                        'classes': 'green', 
                        'parent': parent,
                        'data': {'id' : child_id,
                        'Node_Type': parent,
                        'name': child_id, 
                        to_client_convention['node_json']: _
                        } })     
                    g['edges'].append( {
                                'classes': 'followerEdge',
                                "data": {
                                "id": session['parents_dict'][parent] + '-' + \
                                        child_id,
                                "source": session['parents_dict'][parent],
                                "target": child_id
                                }
                                })   
                break   
            else:
                g['nodes'].append( { 
                        'classes': 'green', 
                        'parent': parent,
                        'data': {'id' : child_id,
                        'Node_Type': parent,
                        'name': child_name, 
                        to_client_convention['node_json']: child
                        } })
                zmqDict(session, child, child_id)
                g['edges'].append( {
                        'classes': 'followerEdge',
                        "data": {
                        "id": session['parents_dict'][parent] + '-' + \
                                child_id,
                        "source": session['parents_dict'][parent],
                        "target": child_id
                        }
                        })
    return g


to_client_convention ={ 
    "node_json": "config-block"
}