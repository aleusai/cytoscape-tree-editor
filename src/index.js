//'use strict';
import React, { useState, lazy, Suspense, useEffect } from "react";
import MyDrawer from "./myDrawer.js";
import PubSub from "pubsub-js";
import createNode from "./js/components/cytoComponent.js";
import UploadFileMouseTrap from "./js/components/uploadMouseTrap.js";
//debugger;

//const NodeEditor = lazy(() => import("./js/components/nodeEditor.js"), {
//  fallback: <div>Loading...</div>,
//});
import NodeEditor from "./js/components/nodeEditor.js";

//const FullConfigEditor = lazy(
//  () => import("./js/components/fullConfigEditor.js"),
//  {
//    fallback: <div>Loading...</div>,
//  }
//);
//import FullConfigEditor from "./js/components/fullConfigEditor.js";


//const PipelineEditor = lazy(() => import("./js/components/pipelineEditor.js"), {
//  fallback: <div>Loading...</div>,
//});
//import PipelineEditor from "./js/components/pipelineEditor.js";

//const DefaultsEditor = lazy(() => import("./js/components/defaultsEditor.js"), {
//  fallback: <div>Loading...</div>,
//});
//import DefaultsEditor from "./js/components/defaultsEditor.js";
//const SaveLoad = lazy(() => import("./js/components/saveLoad.js"), {
//  fallback: <div>Loading...</div>,
//});
//import SaveLoad from "./js/components/saveLoad.js";

import Mydiv from "./js/components/mydiv.js";
import NewWindow from "react-new-window";
//import { uploadFile, forward, backward } from "./emitters";
//const Cytoscape = lazy(() => import("./js/components/cytoComponent"));
import Cytoscape from "./js/components/cytoComponent";
var Mousetrap = require("mousetrap");

//const MySocket = lazy(() => import("././js/components/core.js"), {
//  fallback: <div>Loading SocketIO...</div>,
//});

import { socket } from "././js/components/core.js";

class Nav extends React.Component {
  state = {
    active: "A",
    top: false,
  };

  componentDidMount() {
    let mythis = this;
    Mousetrap.bind("ctrl+w", function () {
      if (mythis.state.active == "A") {
        mythis.setState({ active: "B" });
      } else {
        mythis.setState({ active: "A" });
      }
    });
    Mousetrap.bind("ctrl+p", function () {
      if (mythis.state.hyde == "A") {
        mythis.setState({ hyde: "B" });
      } else {
        mythis.setState({ hyde: "A" });
      }
    });
  }

  componentWillUnmount() {
    Mousetrap.unbind("ctrl+w");
    Mousetrap.unbind("ctrl+p");
  }

  onSelect(a, b) {
    this.setState({
      action: a,
    });
  }

  render() {
    switch (this.state.action) {
      case "Node Editor":
        var ActionComponent = (
          <Suspense fallback={<div>Loading...</div>}>
            <NodeEditor />
          </Suspense>
        );
        break;
      case "Close":
        var ActionComponent = <Mydiv></Mydiv>;
        break;
      default:
        var ActionComponent = <Mydiv></Mydiv>;
    }
    if (this.state.hyde === "A") ActionComponent = <Mydiv></Mydiv>;
    if (this.state.active === "A") {
      return (
        <Suspense fallback={<div>Loading Drawer...</div>}>
          <Mydiv >
            <MyDrawer func={this.onSelect.bind(this)} />
            {ActionComponent}
          </Mydiv>
        </Suspense>
      );
    } else {
      return (
        <Suspense fallback={<div>Loading Drawer window...</div>}>
          <div>
            <NewWindow>
              <MyDrawer func={this.onSelect.bind(this)} />

              <div>The editors in this window control the parent one</div>
              {ActionComponent}
            </NewWindow>
          </div>
        </Suspense>
      );
    }
  }
}

const SocketContext = React.createContext();


const SocketContext2 = React.createContext(socket);

function RenderApp(props) {
  const [myObject, setObject] = useState({ socket: socket });

  useEffect(() => {

    console.log('RenderApp');
  }, []);

  function getObject() {
    return myObject.socket;
  }

  return (
    <Mydiv>
      <SocketContext.Provider
        value={{ getObject: getObject, socket: myObject.socket, setObject: setObject }}
      >
        <SocketContext.Consumer>
          {(value) => (
            <div>
              <Nav socket={value.socket}></Nav>
              <Cytoscape getObject={value.getObject} socket={value.socket} setObject={value.setObject}></Cytoscape>
            </div>
          )}
        </SocketContext.Consumer>
      </SocketContext.Provider>
    </Mydiv>
  );
}



export { SocketContext, SocketContext2 };

export default RenderApp;
