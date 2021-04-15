/*  JS script with socketio calls  */
import cy_layout from "./cytoscape-layout";
import io from "socket.io-client";
import React, { lazy, Suspense, useEffect, useState } from "react";

/* ----- SOCKETIO ------ */

function add_color(el, class_dict_colors) {
  let elements = el;
  if (!elements["nodes"].length) return elements;
  try {
    for (let item of elements["nodes"]) {
      if (item["data"]["name"] === "root") {
        item["classes"] = "red";
      } else {
        item["classes"] = class_dict_colors[item["data"]["Node_Type"]];
      }
    }

    for (let item of elements["edges"]) {
      item["classes"] = "blue";
    }
  } catch (err) {
    console.log("There was a problem with the add_color function, error ", err);
    return elements;
  }

  return elements;
}

function _socket(func = undefined) {
  let socket = io.connect("http://" + document.domain + ":" + location.port);

  socket.on("connected", function (msg) {
    var socket = this;
    var msg = JSON.parse(msg);
    socket['class_list'] = msg["class_list"];
    socket["components"] = Object.keys(msg["class_list"]);
    socket["pipelines"] = msg["pipelines"];
    socket["defaults"] = msg["defaults"];
    socket["initial_defaults"] = msg["defaults"];
    socket["layouts"] = cy_layout.graph_layouts_list;
    socket["to_client_convention"] =
      "to_client_convention" in socket
        ? socket["to_client_convention"]
        : msg["to_client_convention"];
    if (func) {
      func({ socket: socket });
    }
  });

  socket.on("my error", function (msg) {
    alert(msg);
  });

  socket.on("connect", function () {
    this.emit("start connection", {
      data: "User Connected",
    });
  });


  socket.on("my response", function (msg) {
    var socket = this;

    var msg = JSON.parse(msg);
    socket.styles = cy_layout.main_styles;
    socket['subgraph'] = false;
    if (!("defaults" in socket)) socket["defaults"] = msg["defaults"];
    socket.box_selected_nodes = [];

    if (!("graph_type" in socket)) socket.graph_type = "Json"; // initial display, as in the config file
    try {
      var elements_ = add_color(
        msg["elements"],
        socket['class_list']
        // cy_layout.class_dict_colors // to use if overriding server's colors

      );
      var elements = elements_["edges"]
        ? elements_["nodes"].concat(elements_["edges"])
        : elements_["nodes"];
      socket.elements = elements;
    } catch (err) {
      console.log(
        "There was a problem with parsing the data/colours, or it is a backward in history action ",
        err
      );
      var elements = [];
    }

    if ("layout" in socket) {
      var layout = socket["layout"];
    } else {
      var layout = {
        name: "dagre",
        spacingFactor: 1.75,
        boxSelectionEnabled: true,
      };
      socket.layout = layout;
    }

    if (func) func({ ...socket, socket: socket });
  });
  return socket;
}

function MySocket(props) {
  const [myObject, setObject] = useState({ socket: undefined });
  useEffect(() => {
    _socket(props.setObject);
  }, []);
  return <div></div>;
}

export default MySocket;
