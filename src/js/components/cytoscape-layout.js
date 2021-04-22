let graph_layouts = [
  { label: "CIRCLE", value: "circle" },
  { label: "COSE", value: "cose" },
  { label: "BREADTHFIRST", value: "breadthfirst" },
  { label: "COSE-BILKENT", value: "cose-bilkent" },
  { label: "EULER", value: "euler" },
  //{ label: "KLAY", value: "klay" },
  //{ label: "CISE", value: "cise" },
  { label: "DAGRE", value: "dagre" },
  //{ label: "SPREAD", value: "spread" },
  //{ label: "FISHEYE", value: "fisheye" }
];

let graph_layouts_list = ["circle", "cose", "breadthfirst",
  "cose-bilkent", "euler", "dagre"
];

var main_styles = [
  // some style for the extension
  // Group selectors
  {
    selector: "node[name]",
    style: {
      content: "data(name)",
      //"width": "mapData(size, 0, 100, 20, 60)",
      //"height": "mapData(size, 0, 100, 20, 60)"
      //   "tooltip": "data(name)"
    },
  },
  {
    selector: ".eh-handle",
    style: {
      "background-color": "red",
      width: 12,
      height: 12,
      shape: "ellipse",
      "overlay-opacity": 0,
      "border-width": 12, // makes the handle easier to hit
      "border-opacity": 0,
    },
  },

  {
    selector: ".eh-hover",
    style: {
      "background-color": "red",
    },
  },

  {
    selector: ".eh-source",
    style: {
      "border-width": 2,
      "border-color": "red",
    },
  },

  {
    selector: ".eh-target",
    style: {
      "border-width": 2,
      "border-color": "red",
    },
  },

  {
    selector: ".eh-preview, .eh-ghost-edge, .eh-ghost-node",
    style: {
      "background-color": "red",
      "line-color": "red",
      "target-arrow-color": "red",
      "source-arrow-color": "red",
    },
  },

  {
    selector: ".eh-ghost-edge.eh-preview-active",
    style: {
      opacity: 0,
    },
  },
  {
    selector: ".followerEdge2",
    style: {
      "mid-target-arrow-color": "red",
      "mid-target-arrow-shape": "vee",
      "arrow-scale": 2,
      "line-color": "red",
      //"weight":10
    },
  },
  {
    selector: ".followerEdge",
    style: {
      "mid-target-arrow-color": "blue",
      "mid-target-arrow-shape": "vee",
      "arrow-scale": 2,
      "line-color": "#0074D9",
    },
  },
  // Class selectors
  {
    selector: ".red",
    style: {
      "background-color": "red",
      "line-color": "red",
    },
  },
  {
    selector: ".black",
    style: {
      content: "data(name)",
      "background-color": "#000000",
      "line-color": "#000000",
      shape: "square",
      width: 60,
      height: 60,
      opacity: 0.3,
    },
  },
  {
    selector: ".green",
    style: {
      "background-color": "green",
      "line-color": "green",
    },
  },
  {
    selector: ".collapsed-child",
    style: {
      opacity: "0.1",
    },
  },
];


/*
Distinct colors '#e6194b', '#3cb44b', '#ffe119', '#4363d8', 
'#f58231', '#911eb4', '#46f0f0','#f032e6', '#bcf60c', '#fabebe', 
'#008080', '#e6beff', '#9a6324', '#fffac8','#800000', '#aaffc3', 
'#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
*/

// used in case the client overrides the colors form the server
let class_dict_colors = {
  Component1: "yellow",
  Component2: "brown",
  Component3: "cyan",
  Component4: "teal",
  Component5: "navy",
  Component6: "orange",
  Component7: "yellow",
  Component8: "lime",
  Component9: "cyan",
  Component10: "purple"
};


for (const [key, value] of Object.entries(class_dict_colors)) {
  style = {
    selector: '.' + value,
    style: { "background-color": value, "line-color": value },
  };
  main_styles.push(style);
}

style = [{
  selector: ".red2",
  style: {
    content: "data(name)",
    "background-color": "red",
    "line-color": "red",
    shape: "square",
    width: 80,
    height: 80,
    opacity: 1,
  }
},
{
  selector: ".black2",
  style: {
    content: "data(name)",
    "background-color": "#000000",
    "line-color": "#000000",
    shape: "square",
    width: 80,
    height: 80,
    opacity: 1,
  },
}
];
var main_styles = main_styles.concat(style);

let _layout = {
  name: "breadthfirst",
  spacingFactor: 1.75,
  boxSelectionEnabled: true,
};
let style = { width: "100%", height: "300px" };

let layout = {
  graph_layouts: graph_layouts,
  main_styles: main_styles,
  layout: _layout,
  style: style,
  class_dict_colors: class_dict_colors,
  graph_layouts_list: graph_layouts_list
};

export default layout;
