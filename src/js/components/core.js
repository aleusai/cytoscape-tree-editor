import cy_layout from "./cytoscape-layout";
//import io from "socket.io-client";
//import React, { lazy, Suspense, useEffect, useState } from "react";

let class_list = ["Component1", "Component2", "Component3"];

let pipelines = {
  "pipeline0": ['Component1', 'Component2'],
  "pipeline1": ['Component1', 'Component2', 'Component3']
};

let defaults = {};

defaults["Component1"] = {
  "field_1": "component1_value1<pipeline_name>",
  "field_2": "<pipeline_name>",
  "field_3": "component1_value2<pipeline_name>"
};

defaults["Component2"] = {
  "field_1": "component2_value1<pipeline_name>",
  "field_2": "<pipeline_name>",
  "field_3": "component2_value2<pipeline_name>"
};

defaults["Component3"] = {
  "field_1": "component3_value1<pipeline_name>",
  "field_2": "<pipeline_name>",
  "field_3": "component3_value2<pipeline_name>"
};



function _socket() {
  var socket = {};
  console.log('socket class list', socket);
  socket["components"] = class_list;
  socket["pipelines"] = pipelines;
  socket["defaults"] = defaults;
  socket["initial_defaults"] = defaults;
  socket["layouts"] = cy_layout.graph_layouts_list;
  socket["to_client_convention"] = 'config_block';
  socket.styles = cy_layout.main_styles;
  socket['subgraph'] = false;
  if (!("defaults" in socket)) socket["defaults"] = defaults;
  socket.box_selected_nodes = [];
  if (typeof elements == "undefined") {
    var elements = [];
  }
  if (!(elements in socket)) socket['elements'] = elements;
  if (!("graph_type" in socket)) socket.graph_type = "Json"; // initial display, as in the config file

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

  return socket;
}

const socket = _socket();
export { socket };
