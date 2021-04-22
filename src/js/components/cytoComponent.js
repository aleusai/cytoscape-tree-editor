//import cytoscape from "cytoscape/dist/cytoscape.min.js";
import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import dagre from "cytoscape-dagre";
import coseBilkent from "cytoscape-cose-bilkent";
import euler from "cytoscape-euler";
import PubSub from "pubsub-js";
import tippy from "tippy.js";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";
import React, { useContext, Component, useEffect } from "react";
import { SocketContext2 as SocketContext } from "../../index.js";
import CytoscapeComponent from "react-cytoscapejs";
import { saveAs } from "file-saver";
import cy_layout from "./cytoscape-layout";

cytoscape.use(popper);
cytoscape.use(dagre);
cytoscape.use(coseBilkent);
cytoscape.use(euler);

function saveJsonToFile(jsonBlob, filename) {
  var blob = new Blob([jsonBlob], {
    type: "text/plain;charset=utf-8",
  });
  console.log("Saving to file ", filename);
  saveAs(blob, filename);
}

function toRawJson(socket, cy) {
  if (!cy || !socket) return {};
  var Mousetrap = require('mousetrap');
  var dict_to_save = {};
  let root_node = cy.nodes().roots()[0].data()["id"];
  var edgesFromRoot = cy.edges("edge[source=" + '"' + root_node + '"' + "]");
  var rootChildren = edgesFromRoot.targets();
  for (let parent of rootChildren) {
    var parent_name = parent.data()["name"];
    var parent_id = parent.data()["id"];

    if (parent_name == "cameras2") parent_name = "cameras";
    if (parent_name == "processes2") parent_name = "processes";
    dict_to_save[parent_name] = {};
    var edgesFromParent = cy.edges(
      "edge[source=" + '"' + parent_id + '"' + "]"
    );
    var parentChildren = edgesFromParent.targets();
    dict_to_save[parent_name] = (socket["to_client_convention"] in parent.data()) ? JSON.parse(JSON.stringify(parent.data()[socket["to_client_convention"]])) : {};

    for (let child of parentChildren) {
      var child_name = child.data()["name"];

      if (parent_name + 'Parent' in socket["defaults"]) {
        let key = String(child_name);
        let type = socket["defaults"][parent_name + 'Parent'][parent_name + 'Parent']['type'];
        let depth = socket["defaults"][parent_name + 'Parent'][parent_name + 'Parent']['depth'];
        if (type == "list") {
          depth.split('.').reduce((p, c) => p && p[c] || null, dict_to_save[parent_name]).push(child.data()[
            socket["to_client_convention"]]);
        };

      }
      else {
        dict_to_save[parent_name][String(child_name)] = child.data()[
          socket["to_client_convention"]
        ];
      }
    }
  }
  PubSub.publish("fromSocket.getRaw", JSON.stringify(dict_to_save, null, 4));
  return dict_to_save;
}

function CytoBoxSelect(props) {
  const socket = useContext(SocketContext);
  useEffect(() => {
    let cy = props.cytoscapeComponent.current._cy;
    //let socket = JSON.parse(JSON.stringify(props.socket));
    if (cy) {
      cy.on("boxselect", "node", function (event) {
        var node = event.target;
        "box_selected_nodes" in socket
          ? socket["box_selected_nodes"].push(node)
          : (socket.box_selected_nodes = [node]);
        node.addClass("red2");
      });
      cy.on("boxselect", "edge", function (event) {
        var edge = event.target;
        "box_selected_nodes" in socket
          ? socket["box_selected_nodes"].push(edge)
          : (socket.box_selected_nodes = [edge]);
      });
    }
  }, []);
  return <div></div>;
}

function CySpacing(props) {
  const socket = useContext(SocketContext);
  useEffect(() => {
    let cy = props.cytoscapeComponent.current._cy;
    //let socket = JSON.parse(JSON.stringify(props.socket));
    if (socket && !("slider" in socket)) socket.slider = 5;

    var Mousetrap = require("mousetrap");
    if (socket && cy) {
      Mousetrap.bind(["ctrl+shift+m"], function () {
        let slider =
          socket["slider"] < 10 ? socket["slider"] + 0.5 : socket["slider"];
        socket["slider"] = slider;
        switch (socket["layout"]["name"]) {
          case "breadthfirst":
            var layout_target = {
              name: "breadthfirst",
              spacingFactor: slider / 5,
            };
            break;
          case "cose":
            var layout_target = {
              name: "cose",
              componetSpacing: slider * 10,
              padding: 0,
            };
            break;
          case "coseBilkent":
            var layout_target = {
              name: "coseBilken",
              componetSpacing: slider * 10,
              padding: 0,
            };
            break;
          default:
            var layout_target = socket["layout"]
              ? {
                name: socket["layout"]["name"],
                spacingFactor: slider / 5,
              }
              : { name: "dagre", spacingFactor: slider / 5 };
        }
        cy.makeLayout(layout_target).run();
      });
      Mousetrap.bind(["ctrl+shift+n"], function () {
        let slider =
          socket["slider"] > 0 ? socket["slider"] - 0.5 : socket["slider"];
        socket["slider"] = slider;
        switch (socket["layout"]["name"]) {
          case "breadthfirst":
            var layout_target = {
              name: "breadthfirst",
              spacingFactor: slider / 5,
            };
            break;
          case "cose":
            var layout_target = {
              name: "cose",
              componetSpacing: slider * 10,
              padding: 0,
            };
            break;
          case "coseBilkent":
            var layout_target = {
              name: "coseBilken",
              componetSpacing: slider * 10,
              padding: 0,
            };
            break;
          default:
            var layout_target = socket["layout"]["name"]
              ? {
                name: socket["layout"]["name"],
                spacingFactor: slider / 5,
              }
              : { name: "dagre", spacingFactor: slider / 5 };
        }
        cy.makeLayout(layout_target).run();
      });
    }
  }, [socket]);

  return <div></div>;
}

function CyLayout(props) {
  useEffect(() => {
    function mySubscriber(msg, data) {
      console.log("Changing Layout to", data);
      let cy = props.cytoscapeComponent.current._cy;
      cy.makeLayout({ name: data }).run();
    }
    const token = PubSub.subscribe("toCytoLayout", mySubscriber);
    function unsub(t) { }
    return unsub(token);
  }, []);

  return <div></div>;
}

function CyCollapseExpand(props) {
  useEffect(() => {
    let cy = props.cytoscapeComponent.current._cy;
    var Mousetrap = require("mousetrap");
    if (cy) {
      Mousetrap.bind(["command+k", "ctrl+k"], function () {
        for (let item_a of cy.$("node:selected")) {
          for (let item_b of item_a.successors()) {
            let nodeClasses = item_b.classes();
            if (nodeClasses.includes("collapsed-child")) {
              item_b.removeClass("collapsed-child");
            } else {
              item_b.addClass("collapsed-child");
            }
          }
        }
        cy.json(cy.json());
        return false;
      });
    }
  });

  return <div></div>;
}

function CyNodes(props) {
  const socket = useContext(SocketContext);
  useEffect(() => {
    let cy = props.cytoscapeComponent.current._cy;
    //let socket = JSON.parse(JSON.stringify(props.socket));
    if (cy)
      cy.on("click", "node", function (event) {
        PubSub.publish("socket.out.click", this.data());
      });
    cy.nodes().on("tap", "node", function (event) {
      let selected = [];
      for (let item of cy.$("node:selected")) {
        selected.push(item.data["Node_Type"]);
      }
      PubSub.publish("socket.out.tap", selected);
    });
  }, []);

  return <div></div>;
}

function CyMouseOver(props) {
  const socket = useContext(SocketContext);
  useEffect(() => {
    let cy = props.cytoscapeComponent.current._cy;
    //let socket = JSON.parse(JSON.stringify(props.socket));
    if (cy && socket) {
      cy.on("mouseover", "node", function (event) {
        try {
          event.target.tippy.show();

          var node = event.target;
          socket.zoom = cy.zoom();
          socket.pan = cy.pan();
          if (!("name" in node.data())) {
            // coming from the edges-handler extension
            return;
          }
          var id_mouseover_node = event.target.id();
          socket.node = node;
          socket.value = node.data();

          // We highlight the mouseOn element
          cy.elements("node#" + String(id_mouseover_node)).addClass("black");

          // for all the other elements we remove the class, so also previous ones
          var filtered = cy.nodes().filter(function (ele) {
            return ele.data("id") !== String(id_mouseover_node);
          });
          for (let item of filtered) {
            item.removeClass("black");
          }
          // red flow
          for (let item of cy.filter("edge")) {
            item.addClass("followerEdge");
            item.removeClass("followerEdge2");
          }
          for (let item of cy
            .elements("node#" + String(id_mouseover_node))
            .successors()) {
            item.addClass("followerEdge2");
            item.removeClass("followerEdge");
          }
          if ("layout" in socket && socket["layout"]["name"] == "fisheye") {
            let parent = cy.$(event.target).incomers(function (ele) {
              return ele.isNode();
            });
            cy.fit(parent.successors());
          }

          cy.json();
          PubSub.publish("socket.out.mouseOver", node.data());
        } catch (err) {
          console.log("Tippy error", err);
        }
      });
    }
  });

  return <div></div>;
}

function CyTabs(props) {
  const socket = useContext(SocketContext);
  useEffect(() => {
    let cy = props.cytoscapeComponent.current._cy;
    //let socket = JSON.parse(JSON.stringify(props.socket));
    if (socket && cy) {
      var Mousetrap = require('mousetrap');
      Mousetrap.bind(["ctrl+t"], function () {
        var rootChildren = cy
          .nodes()
          .roots()[0]
          .outgoers(function (ele) {
            return ele.isNode();
          });

        if (socket && "tabNodeIndex" in socket) {
          socket["tabNodeIndex"] =
            rootChildren.length > socket["tabNodeIndex"]
              ? socket["tabNodeIndex"] + 1
              : (socket["tabNodeIndex"] = 0);
          var nodes = cy.$(rootChildren[socket["tabNodeIndex"]]).outgoers();
        } else {
          var nodes = cy.$(rootChildren[0]).outgoers();
          if (socket) socket.tabNodeIndex = 0;
        }

        cy.fit(nodes);
      });
    }
  });

  return <div></div>;
}

function CyNodeSearch(props) {
  const socket = useContext(SocketContext);
  useEffect(() => {
    /* Searching for a Node */
    let cy = props.cytoscapeComponent.current._cy;
    //let socket = JSON.parse(JSON.stringify(props.socket));
    var Mousetrap = require("mousetrap");
    if (cy && socket) {
      Mousetrap.bind(["ctrl+f"], function () {
        var nodeName = window.prompt("Node name to search", "");
        var filtered = cy.nodes().filter(function (ele) {
          return ele.data("name").includes(nodeName);
        });
        for (let item of filtered) {
          item.addClass("black2");
        }
      });
      /* Undo Searching for a Node */
      Mousetrap.bind(["command+g", "ctrl+g"], function () {
        let nodes = cy.nodes();
        for (let item of nodes) {
          item.removeClass("black2");
          item.removeClass("red2");
          item.unselect();
        }
        socket.box_selected_nodes = [];
      });
    }
  });

  return <div></div>;
}

function CreateJson(props) {
  useEffect(() => {
    function mySubscriber(msg, data) {
      let cy = props.cytoscapeComponent.current._cy;
      toRawJson(props.socket, cy);
    }
    const tokenGetRaw = PubSub.subscribe("toSocket.getRaw", mySubscriber);
    function unsub(t) {
      //PubSub.unsubscribe(t);
    }
    return unsub(tokenGetRaw);
  });

  return <div></div>;
}


function CyPopper(props) {
  useEffect(() => {
    let cy = props.cytoscapeComponent.current._cy;
    const handleColorType = (type) => {
      switch (type) {
        case "number":
          return "darkorange";
        case "string":
          return "green";
        case "boolean":
          return "blue";
        case "null":
          return "magenta";
        case "key":
          return "red";
        default:
          return "#fff";
      }
    };

    function syntaxHighlight(json) {
      if (typeof json != "string") {
        json = JSON.stringify(json, undefined, 2);
      }
      json = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
          var cls = "number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "key";
            } else {
              cls = "string";
            }
          } else if (/true|false/.test(match)) {
            cls = "boolean";
          } else if (/null/.test(match)) {
            cls = "null";
          }
          return (
            '<span style="color:' +
            handleColorType(cls) +
            '">' +
            match +
            "</span>"
          );
        }
      );
    }

    function makePopper(ele) {
      let ref = ele.popperRef(); // used only for positioning
      ele.tippy = tippy(ref, {
        // tippy options:
        theme: "light-border",
        allowHTML: true,
        content: syntaxHighlight(ele.data()),

        trigger: "manual", // probably want manual mode
      });
    }

    if (cy) {
      if (cy.nodes()) {
        cy.ready(function () {
          cy.nodes().forEach(function (ele) {
            makePopper(ele);
          });
          cy.nodes().unbind("mouseout");
          cy.nodes().bind("mouseout", (event) => event.target.tippy.hide());
        });
      }
    }
  });

  return <div></div>;
}



function DeleteNode(props) {
  const socket = useContext(SocketContext);
  useEffect(() => {
    /* Delete selected nodes  */
    var Mousetrap = require("mousetrap");
    //let socket = props.socket;
    if (socket && cy) {
      Mousetrap.bind(["command+del", "ctrl+del", "ctrl+d"], function () {
        let deleteElements = [];
        let cy = props.cytoscapeComponent.current._cy;
        if (
          socket &&
          "box_selected_nodes" in socket &&
          socket["box_selected_nodes"].length != 0
        ) {
          for (let item of socket["box_selected_nodes"]) {
            deleteElements.push(item.data()["id"]);
            cy.remove("#" + item.data()["id"]);
            item.unselect();
          }
          socket.box_selected_nodes = [];
          let elements = cy.json().elements["edges"]
            ? cy.json().elements["nodes"].concat(cy.json().elements["edges"])
            : cy.json().elements["nodes"];
          if (socket["graph_type"] == "Json") {
            socket["elements"] = elements;
          }
          socket["graph_type"] == "Json"

          //socket.emit("my event", {
          //  action: "deleteNode",
          //  content: [
          //    deleteElements,
          //    { answer: socket["graph_type"] == "Json" },
          //  ],
          //});
          return;
        }

        if (!!socket["node"] && socket["node"].isNode() === true) {
          let outgoers = socket["node"].outgoers(function (ele) {
            return ele.isEdge();
          });
          let incomers = socket["node"].incomers(function (ele) {
            return ele.isEdge();
          });
          for (let item of outgoers) {
            deleteElements.push(item.id());
            cy.remove("#" + item.id());
          }
          for (let item of incomers) {
            deleteElements.push(item.id());
            cy.remove("#" + item.id());
          }
          cy.remove("#" + socket["node"].id());
          deleteElements.push(socket["node"].id());

          let elements = cy.json().elements["edges"]
            ? cy.json().elements["nodes"].concat(cy.json().elements["edges"])
            : cy.json().elements["nodes"];
          if (socket["graph_type"] == "Json") {
            socket["elements"] = elements;
          }
          //socket.emit("my event", {
          //  action: "deleteNode",
          //  content: [
          //    deleteElements,
          //    {
          //      answer_channel:
          //        socket["graph_type"] == "Json"
          //    },
          //  ],
          //});

          socket.node = null;
        }
      });
    }
  }, [props.socket]);

  return <div></div>;
}

function CloneNode(props) {
  /* Clone node */
  const socket = useContext(SocketContext);
  useEffect(() => {
    var Mousetrap = require("mousetrap");
    //let socket = props.socket;
    let cy = props.cytoscapeComponent.current._cy;
    if (cy && socket) {
      Mousetrap.bind(["command+c", "ctrl+c"], function () {
        if (
          socket &&
          "box_selected_nodes" in socket &&
          socket["box_selected_nodes"].length
        ) {
          for (let item of socket["box_selected_nodes"]) {
            try {
              var source = cy
                .elements(
                  "edge#" + String(socket["box_selected_nodes"][item]["id"])
                )
                .data().source;
              var target = cy
                .elements(
                  "edge#" + String(socket["box_selected_nodes"][item]["id"])
                )
                .data().target;
            } catch (err) {
              var source = "";
              var target = "";
            }

            socket.emit("my event", {
              action: "cloneNode",
              content: [
                item.data()["id"],
                item.data()["Node_Type"],
                source,
                target,
              ],
            });
          }
          return;
        }

        if (
          "node" in socket &&
          socket["node"] &&
          socket["node"].isNode() === true
        ) {
          socket.emit("my event", {
            action: "cloneNode",
            content: [
              socket["node"].id(),
              socket["node"].data()["Node_Type"],
              "",
              "",
            ],
          });
        }
      });
    }
  }, [props.socket]);

  return <div></div>;
};

function createNode(node_type, cy, myjson, name, socket) {

  if (!("parents_dict" in socket)) {
    socket['parents_dict'] = {};
  };

  var id = Math.random().toString(20).substr(2, 6);
  let c = node_type + '-' + id;
  let parent = node_type;
  if (name) {
    var name = name;
  }
  else {
    var name = c;
  }
  if (!('root' in socket['parents_dict'])) {
    var id_root = Math.random().toString(20).substr(2, 6);
    socket['parents_dict']["root"] = id_root;
    cy.add({
      group: 'nodes', 'classes': 'red', data: {
        'classes': 'red',
        'parent': 'root',
        'id': id_root,
        'Node_Type': 'root',
        'name': 'root'
      }
    });
  };

  if (myjson) {
    cy.add({
      group: 'nodes', 'classes': cy_layout.class_dict_colors[node_type],
      data: {
        'classes': cy_layout.class_dict_colors[node_type],
        'parent': parent,
        'id': c,
        'Node_Type': parent,
        'name': name,
        [socket["to_client_convention"]]: myjson
      }
    })
  }
  else {
    cy.add({
      group: 'nodes',
      'classes': cy_layout.class_dict_colors[node_type],
      data: {
        'classes': cy_layout.class_dict_colors[node_type],
        'id': c,
        'Node_Type': parent + '_' + c,
        'name': name,
      }
    });
  }
  if (!(parent in socket['parents_dict'])) {
    var id_root_parent = Math.random().toString(20).substr(2, 6);

    socket['parents_dict'][parent] = id_root_parent;
    if (node_type + 'Parent' in socket['defaults']) {

      cy.add({
        group: 'nodes', 'classes': cy_layout.class_dict_colors[node_type], data: {
          'classes': 'green',
          'parent': 'root',
          'id': id_root_parent,
          'Node_Type': parent,
          'name': parent,
          [socket["to_client_convention"]]: parentData
        }
      });
    }
    else {
      cy.add({
        group: 'nodes', 'classes': cy_layout.class_dict_colors[node_type],
        data: {
          'classes': 'green',
          'parent': 'root',
          'id': id_root_parent,
          'Node_Type': parent,
          'name': parent
        }
      });
    }
    cy.add({
      group: 'edges', data: {
        'classes': 'followerEdge',
        "id": 'root' + '-' + parent,
        "source": socket['parents_dict']['root'],
        "target": socket['parents_dict'][parent]

      }
    });
  };
  cy.add({
    group: 'edges', data: {
      'classes': 'followerEdge',
      "id": 'root' + '-' + parent + '-' + c,
      "source": socket['parents_dict'][parent],
      "target": c
    }
  });


  return socket;

};


class Cytoscape extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.myRefHeadless = React.createRef();
    this.state = {};
  }

  //static socket = SocketContext;

  componentWillUnmount() {
    try {
      PubSub.unsubscribe(socket['token']);
      PubSub.unsubscribe(socket['tokenAddNode']);
      PubSub.unsubscribe(socket['tokenEditNode']);
    } catch (err) {
      console.log(" Cytoscape ERROR", err);
    }
  }
  componentDidUpdate() {
    console.log('CYTO DID UPDATE', this.props.socket);
  }
  componentDidMount() {
    let mythis = this;
    try {
      let socket = { ...mythis.props.socket };
      //var t0 = performance.now()
      let cy = mythis.myRef.current._cy;
      let cyHeadless = mythis.myRefHeadless.current._cy;
      cyHeadless.json({ elements: socket.elements });
      if (!socket.subgraph) {
        if (socket.elements && socket.elements.length <= 500) {
          cy.add(socket.elements);
        }
        else {
          cy.add(cyHeadless.nodes().roots().closedNeighborhood());
        }
      };
      socket['subgraphs'] = [];
      if (cyHeadless.nodes().roots()[0]) {
        let root_node = cyHeadless.nodes().roots()[0].data()["id"]; // only one root  here
        var edgesFromRoot = cyHeadless.edges("edge[source=" + '"' + root_node + '"' + "]");
        var rootChildren = edgesFromRoot.targets();
        socket['subgraphs'].push.apply(socket['subgraphs'], rootChildren.map(x => (x.data()['name'])));
        socket['subgraphs'].push('ALL');
      }

      socket['cy'] = cy;
      if (!('tokenEditNode' in socket)) {
        function mySubscriberEditNode(msg, data) {
          let cy = mythis.myRef.current._cy;
          let socket = mythis.props.getObject();
          let node_data = JSON.parse(data);
          cy.getElementById(node_data['id']).data(node_data);
          mythis.props.setObject({ socket: socket });
        };
        socket['tokenEditNode'] = PubSub.subscribe("editNode", mySubscriberEditNode);
      }

      if (!('tokenAddNode' in socket)) {
        function mySubscriberAddNode(msg, data) {
          let cy = mythis.myRef.current._cy;
          let socket = mythis.props.getObject();
          let myjson = socket['defaults'][data];
          let node_type = data
          socket = createNode(node_type, cy, myjson, '', socket);
          let layout = !(layout in socket) ? 'dagre' : socket['layout'];
          if (!(layout in socket)) socket['layout'] = layout;
          cy.makeLayout({ name: layout }).run();
          mythis.props.setObject({ socket: socket });
        };
        socket['tokenAddNode'] = PubSub.subscribe("addNode", mySubscriberAddNode);
      }

      if (!('token' in socket)) {
        function mySubscriber(msg, data) {
          let cy = mythis.myRef.current._cy;
          let socket = mythis.props.getObject();
          cy.elements().remove();
          if (data == 'ALL') {
            cy.add(cyHeadless.elements());
          }
          else {
            cy.add(cyHeadless.filter('node[name = "' + data + '"]').closedNeighborhood());
          }
          cy.ready(function () {
            cy.makeLayout(mythis.props.socket.layout).run();
          });
          mythis.setState({ popper: cy });
          socket['subgraph'] = true;
          mythis.props.setObject({ socket: socket });
        }
        socket['token'] = PubSub.subscribe("showSubgraph", mySubscriber);
      }

      if (socket && socket.layout)
        cy.ready(function () {
          cy.makeLayout(socket.layout).run();
        });
      mythis.props.setObject({ socket: socket });
    } catch (err) {
      console.log("Cytoscape ERROR", err);
    }
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.state.token);
  }

  render() {
    let mythis = this;
    let socket = this.props.socket;
    if (
      socket &&
      socket.elements &&
      socket.elements.length &&
      socket.styles
    ) {
      var layout = socket.layout ? socket.layout : { name: "dagre" };
      var styles = socket.styles;
    } else {
      var layout = {
        name: "circle"
      };
      var styles = socket['styles'];
    }


    return (
      <div>
        <CytoscapeComponent
          layout={layout}
          elements={[]}
          stylesheet={styles}
          headless={true}
          ref={mythis.myRefHeadless}
        ></CytoscapeComponent>
        <CytoscapeComponent
          layout={layout}
          elements={[]}
          stylesheet={styles}
          id={mythis.props.id}
          ref={mythis.myRef}
          style={{ height: '100vh', width: '100vw' }}
        ></CytoscapeComponent>
        <CyLayout cytoscapeComponent={mythis.myRef}></CyLayout>
        <DeleteNode
          socket={mythis.props.socket}
          cytoscapeComponent={mythis.myRef}
        ></DeleteNode>
        <CloneNode
          socket={mythis.props.socket}
          cytoscapeComponent={mythis.myRef}
        ></CloneNode>
        <CyMouseOver
          socket={mythis.props.socket}
          cytoscapeComponent={mythis.myRef}
        //cy={mythis.state.cy}
        ></CyMouseOver>
        <CytoBoxSelect
          socket={mythis.props.socket}
          cytoscapeComponent={mythis.myRef}
        ></CytoBoxSelect>
        <CyCollapseExpand cytoscapeComponent={mythis.myRef}></CyCollapseExpand>
        <CyNodes
          socket={mythis.props.socket}
          cytoscapeComponent={mythis.myRef}
        ></CyNodes>
        <CyPopper
          socket={mythis.props.socket}
          cytoscapeComponent={mythis.myRef}
          popper={mythis.state.popper}
        ></CyPopper>
        <CyNodeSearch
          socket={mythis.props.socket}
          cytoscapeComponent={mythis.myRef}
        ></CyNodeSearch>
        <CySpacing
          socket={mythis.props.socket}
          cytoscapeComponent={mythis.myRef}
        ></CySpacing>
        <CyTabs
          socket={mythis.props.socket}
          cytoscapeComponent={mythis.myRef}
        ></CyTabs>
        <CreateJson
          socket={mythis.props.socket}
          cytoscapeComponent={mythis.myRefHeadless}
        ></CreateJson>
      </div>
    );
  }
}

export default Cytoscape;
export { createNode };
