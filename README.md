# Cytoscape Tree Editor

The App provides a tool to create/upload/download/edit a (Cytoscape) Tree. 

The Tree itself is made of several nodes, which differ from one another because of the data payload that they have: the nodes can be 
thought of as different components, if one thinks of such a Tree as e.g. a configuration file. Each node is created with a default 
data payload, specific to that node type. 

When editing the node, one can create/clone/delete a node, as well as modify the payload content. 

A Tree can be saved to a json file, with a two nesting level; the same structure is used to upload a new Tree.

The App uses a Flask backend with socket-io and React on the front-end. Future extensions will include a full fledged docker solution for the front-end and back-end. 

To use the app do the following:

1) npm -i

2) python3 main.py

3) Open the browser at localhost:5000

Please note that the security/production environment of Flask is not addressed in this repository, and it should be run with e.g. Nginx and Gunicorn.

