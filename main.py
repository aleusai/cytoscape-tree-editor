from flask import session, request, send_from_directory, Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room
from flask_session import Session
from flask_compress import Compress
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
from flask_manage_webpack import FlaskManageWebpack
import json
from callbacks_helpers import callbacks_functions as cbf
from nx import to_client_convention, from_file_to_cy, classes as pc
import sys
import os
import copy
from flask_talisman import Talisman

class_list = pc.class_list
pipelines = pc.pipelines
elements = {'nodes': [], 'edges': []}
app = Flask(__name__)
SELF = "'self'"
content_security_policy={
        'default-src': [
            SELF
        ],
        'img-src': '*',
        'script-src': [
             SELF
        ],
        'script-src-elem': [
          #  '\'unsafe-inline\'',
         SELF
        ],
        'style-src': [
        #    '\'unsafe-inline\'',
            SELF
        ],
        'style-src-elem':[
       #     '\'unsafe-inline\'',
        SELF

        ],
        'font-src': '*',
        'connect-src':'*',
    }
#Talisman(app,
#    content_security_policy=content_security_policy,
#    content_security_policy_nonce_in=['script-src','style-src','style-src-elem','default-src']
#)


Compress(app)
# Register Extension
manage_webpack = FlaskManageWebpack()
#manage_webpack.init_app(app)

auth = HTTPBasicAuth()
socketio = SocketIO(app, cors_allowed_origins="*", max_http_buffer_size=10000000)
Session(app)

try:
    users = {
        "password": generate_password_hash(os.getenv('PASSWORD')),
        "user": os.getenv('USERNAME')
    }
except:
    users = {
        "password": '',
        "user": ''
    }

@auth.verify_password
def verify_password(username, password):
    if username == '': 
        return False
    if username == users['user'] and \
            check_password_hash(users['password'],password):
        return username

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/')
@auth.login_required
def sessions():
    return render_template('index.html')

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    print('Entered room ', room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    print('Leaving room ', room)

@socketio.on('getStartupDefaults')
def get_startup_defaults(jsonblob, methods=['GET', 'POST']):
    print('Startup Defaults!')
    try:
        session['defaults'] =  pc.defaults
    except:
        error = sys.exc_info()[0]
        print(error)
        socketio.emit(
            'my error', "There was an error in your request!", room=request.sid)


@socketio.on('updateDefaults')
def update_defaults(jsonblob, methods=['GET', 'POST']):
    print('Updating Defaults!')
    try:
        session['defaults'] =  json.loads(jsonblob['content'])
    except:
        error = sys.exc_info()[0]
        print(error)
        socketio.emit(
            'my error', "There was an error in your request!", room=request.sid)


@socketio.on('start connection')
def start_connection(jsonblob, methods=['GET', 'POST']):
    session['defaults'] = pc.defaults
    session['_shared_state'] = {}
    # graphs_list saves the graph changes so we can roll back/forward
    session['graphs_list'] = [{}]
    session['index'] = 0
    session['graph_layout'] = "simple"
    print('STARTING SESSION', request.sid)
    defaults = copy.deepcopy(session['defaults'])

    final_values = {'elements': {'nodes': [], 'edges': []},
                    'class_list': class_list, 'pipelines': pipelines,
                    'defaults': defaults, 'error': '', "to_client_convention": to_client_convention['node_json']}
    socketio.emit('connected', json.dumps(final_values), room=request.sid)

def toClient(func):
    try:
        elements, final_values = toClient2(func)
        socketio.emit('my response', json.dumps(
            final_values), room=request.sid)
    except:
        error = sys.exc_info()[0]
        print(error)
        socketio.emit(
            'my error', "There was an error in your request!", room=request.sid)
        return []
    return elements

def toClient2(func):
    try:
        elements = func
        final_values = {'elements': elements,
                        'class_list': class_list, 'error': ''}
    except:
        error = sys.exc_info()[0]
        print(error)
        socketio.emit(
            'my error', "There was an error in your request!", room=request.sid)
        return [], {}
    return elements, final_values

@socketio.on('my event')
def handle_my_custom_event(jsonblob, methods=['GET', 'POST']):

    if 'action' in jsonblob and jsonblob['action'] == 'forward':
        print('Action: forward')
        toClient(cbf.index_move(+1, session))

    if 'action' in jsonblob and jsonblob['action'] == 'backward':
        print('Action: backward')
        toClient(cbf.index_move(-1, session))

    if 'action' in jsonblob and jsonblob['action'] == 'addPipeline':
        print('Action: addPipeline', jsonblob)
        n = 200
        # we split the list in chunks in case of lots of nodes
        final = [jsonblob['content'][0][i * n:(i + 1) * n] \
            for i in range((len(jsonblob['content'][0]) + n - 1) // n )] 
        g = copy.deepcopy(session['graphs_list'][session['index']]) 
        final_values = {}
        for index, _ in enumerate(final):
            bb = [ _ , jsonblob['content'][1] ]
            # tic0 = time.perf_counter()
            g, final_values = toClient2(cbf.add_pipeline(bb, session, g))
            if index == 0:
                socketio.emit('my response', json.dumps(
                    final_values), room=request.sid)
            # toc0 = time.perf_counter()
            socketio.sleep(0) 
        cbf.graph_append(g, session, True)
        socketio.emit('my response', json.dumps(
            final_values), room=request.sid)
        if 'warning' in session and session['warning']:  
            socketio.emit(
                'my error', session['warning'], room=request.sid)
            session['warning'] = ''

    if 'action' in jsonblob and jsonblob['action'] == 'addNode':
        print('Action: addNode')
        toClient(cbf.add_node(jsonblob, session))

    if 'action' in jsonblob and jsonblob['action'] == 'deleteNode':
        print('Action: deleteNode')
        toClient(cbf.delete_node(jsonblob['content'][0], session))

    if 'action' in jsonblob and jsonblob['action'] == 'cloneNode':
        print('Action: cloneNode')
        toClient(cbf.clone_node(jsonblob, session))

    if 'action' in jsonblob and jsonblob['action'] == 'editNode':
        print('Action: editNode')

        try:
            content = jsonblob['content'] if type(
                jsonblob['content']) is dict else json.loads(jsonblob['content'])
            node_info = {'id': content['id'], 'name': content['name'], 'Node_Type': content['Node_Type'],
                         to_client_convention['node_json']: content[to_client_convention['node_json']] if to_client_convention['node_json'] in content else ''}
            elements, id_edited_node, new_edited_node = cbf.edit_node(
                node_info, session)
            final_values = {'elements': elements,
                            'class_list': class_list,
                            'error': '', "new_edited_node": new_edited_node}
            socketio.emit('my response', json.dumps(
                final_values), room=request.sid)
        except:
            error = sys.exc_info()[0]
            print('There was an error in your request!', error)
            socketio.emit(
                'my error', "There was an error in your request!", room=request.sid)

    if 'action' in jsonblob and jsonblob['action'] == 'uploadFile':
        # This function is also used to generate a new raw json config file
        print('Action: uploadFile')
            
        # Turning off second graph display (just too complicated)
        error = ''
        mydata_dict = {}
        elements = []
        try:
            try:
                mydata_dict = json.loads(jsonblob['content'])
            except:
                error = sys.exc_info()[0]
                print('Error in the data format ', error)
                socketio.emit('my error', "There was an error in your request! " + error, room=request.sid)
            
            g = from_file_to_cy(mydata_dict, session)

            elements = cbf.graph_append(g, session, True)
           
            final_values = {'elements': elements,
                                                     'class_list': class_list}
            # tic0 = time.perf_counter()
            socketio.emit('my response', json.dumps(
            final_values), room=request.sid)
            # toc0 = time.perf_counter()
            # print(f"SOCKETIO EMIT PERFORMANCE: {toc0 - tic0:0.4f} seconds")
        except:
            error = sys.exc_info()[0]
            print('Error in uploading or json updating', error)
            socketio.emit(
                'my error', "There was an error in your request! " + error, room=request.sid)





if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port='5000', debug=True)
