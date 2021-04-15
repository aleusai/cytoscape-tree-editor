# Cytoscape Tree Editor

This App provides a tool to create/upload/download/edit a Cytoscape Tree (go to https://js.cytoscape.org/ for further information on Cytoscape). It is built using Flask with socket-io as backend, and Javascript with React as front-end: this latter one in particular leverages the Cytoscape Javascript library, as well as the Ace editor to e.g. allow in-browser editing of the Tree's nodes' data payloads. 
Future extensions will also include a full fledged docker solution for the front-end and back-end. 

Cytoscape is initialized in headless mode, which allows for a performance boost when handling big Trees comprising of thousands of nodes.

A Tree is made of several nodes, which differ from one another because of the data payload that they have: the nodes can be 
thought of as different components, if one thinks of such a Tree as e.g. a configuration file. Each node is created with a default 
data payload, specific to that node type, which can then be edited/changed.. 

When editing the Tree, one can create/clone/delete a node, as well as modify the payload content. 

A Tree can be saved to a json file with a two nesting level; the same structure is used to upload a new Tree. You should adapt or change the corresponding functions, in case you need a different structure to start from (this is also true if you are using the native Cytoscape structure i.e. you will have to change the code).

To use the App do the following:

0) Clone this repository and cahnge directory into it

1) Run ```npm install``` (the force flag might be required for those packages that are not yet compatible with the latest React version, this will be resolved eventually)

2) Run ```npm run build --profile; npm run postbuild```  (development build, you can also run the production build in case)

3) Set the environment variables ```USERNAME``` and ```PASSWORD``` and run ```python3 main.py```

4) Open the browser at localhost:5000

Please note that the security/production environment of Flask is not addressed in this repository, and it should be run with e.g. Nginx and Gunicorn.

