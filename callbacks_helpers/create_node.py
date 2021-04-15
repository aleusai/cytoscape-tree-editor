from nx import to_client_convention, classes as pc
from string import ascii_letters, digits
from random import choice
import copy


def create_node(node_type, g, myjson=None, name=None, session=None) -> dict():
    """
    :param value: Node Type (string) i.e. Class name; with no Graph it is "Create Node"
    :param myjson: myjson blob as edited or cloned from another node
    :param g: starting Graph (dictionary)
    :param name: name of the node, if given
    :return:
    """

    # parents_dict contains the dict with keys names and values ids 
    # (cytoscape has problems with nodes with same ids)
    if "parents_dict" not in session:
        session['parents_dict'] = {}

    if not g: 
        g = {}
        g['nodes'] = []
        g['edges'] = []

    id = ''.join([choice(ascii_letters + digits) for i in range(6)])
    c = node_type + '-' + id
    parent = node_type
    name = name if name else c
    if 'root' not in session['parents_dict']:
        id_root = 'root-' + ''.join([choice(ascii_letters + digits) for i in range(6)])
        session['parents_dict']["root"] = id_root
        g['nodes'].append( { 
                            'classes': 'red', 
                            'parent': 'root',
                            'data': {'id' : id_root,
                            'Node_Type': 'root',
                            'name': 'root'
                            } })
 

    g['nodes'].append( {    'classes': 'green',
                            'parent': parent,
                            'data': {'id' : c,
                            'Node_Type': parent,
                            'name': name,
                            to_client_convention['node_json']: myjson
                            } }) if myjson else \
                                g['nodes'].append( { 
                            'data': {'id' : c,
                            'Node_Type': parent + '_' + c,
                            'name': name,
                            } })

    if  parent not in session['parents_dict']:
        if node_type + 'Parent' in session['defaults']:
            parentData = copy.deepcopy(session['defaults'][node_type + 'Parent'])
            del parentData[node_type + 'Parent']
        id_root_parent = 'root_' + parent + '_' + ''.join([choice(ascii_letters + digits) for i in range(6)])
        session['parents_dict'][parent] = id_root_parent
        if node_type + 'Parent' in session['defaults']:
            g['nodes'].append( { 'classes': 'green',
                            'parent': 'root',
                            'data': {'id' : id_root_parent,
                            'Node_Type': parent,
                            'name': parent,
                            to_client_convention['node_json']: parentData
                            } })
        else:
            g['nodes'].append( { 'classes': 'green',
                'parent': 'root',
                'data': {'id' : id_root_parent,
                'Node_Type': parent,
                'name': parent
                } })

    g['edges'].append( {
                        'classes': 'followerEdge',
                        "data": {
                        "id": 'root' + '-' + parent + '-' + c,
                        "source": session['parents_dict'][parent],
                        "target": c
                        }
                        })
    g['edges'].append( {
                        'classes': 'followerEdge',
                        "data": {
                        "id": 'root' + '-' "root" + '-' + parent,
                        "source": session['parents_dict']['root'],
                        "target": session['parents_dict'][parent]
                        }
                        })
    return g
