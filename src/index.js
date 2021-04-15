//'use strict';
import React, { useState, lazy, Suspense, useEffect } from "react";
import MyDrawer from "./myDrawer.js";
import UploadFileMouseTrap from "./js/components/uploadMouseTrap.js";
//debugger;

const NodeEditor = lazy(() => import("./js/components/nodeEditor.js"), {
  fallback: <div>Loading...</div>,
});
const FullConfigEditor = lazy(
  () => import("./js/components/fullConfigEditor.js"),
  {
    fallback: <div>Loading...</div>,
  }
);
const PipelineEditor = lazy(() => import("./js/components/pipelineEditor.js"), {
  fallback: <div>Loading...</div>,
});
const DefaultsEditor = lazy(() => import("./js/components/defaultsEditor.js"), {
  fallback: <div>Loading...</div>,
});
const SaveLoad = lazy(() => import("./js/components/saveLoad.js"), {
  fallback: <div>Loading...</div>,
});

import Mydiv from "./js/components/mydiv.js";
//import NewWindow from "react-new-window";
import { uploadFile, forward, backward } from "./emitters";
const Cytoscape = lazy(() => import("./js/components/cytoComponent"));

var Mousetrap = require("mousetrap");

const MySocket = lazy(() => import("././js/components/core.js"), {
  fallback: <div>Loading SocketIO...</div>,
});

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
      case "Save/Load":
        var ActionComponent = (
          <Suspense fallback={<div>Loading...</div>}>
            <SocketContext.Consumer>
              {(value) => (
                <SaveLoad
                  forward={forward.bind(value.socket)()}
                  backward={backward.bind(value.socket)()}
                  uploadTo={uploadFile.bind(value.socket)()}
                  jsonFile={value.socket["rawJson"]}
                />
              )}
            </SocketContext.Consumer>
          </Suspense>
        );
        break;
      case "Full Config Editor":
        var ActionComponent = (
          <Suspense fallback={<div>Loading...</div>}>
            <FullConfigEditor />
          </Suspense>
        );
        break;
      case "Defaults Editor":
        var ActionComponent = (
          <Suspense fallback={<div>Loading...</div>}>
            <DefaultsEditor />
          </Suspense>
        );
        break;
      case "Pipeline Editor":
        var ActionComponent = (
          <Suspense fallback={<div>Loading...</div>}>
            <PipelineEditor />
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
            <MyDrawer func={this.onSelect.bind(this)} />
            
              <div>The editors in this window control the parent one</div>
              {ActionComponent}
            
          </div>
        </Suspense>
      );
    }
  }
}

const SocketContext = React.createContext();

function RenderApp(props) {
  const [myObject, setObject] = useState({ socket: undefined });

  useEffect(() => {
    console.log('RenderApp');
  }, []);

  return (
    <Mydiv>
      <Suspense fallback={<div>Loading SocketIO...</div>}>
        <SocketContext.Provider
          value={{ socket: myObject.socket, setObject: setObject }}
        >
          <SocketContext.Consumer>
            {(value) => (
              <div>
                <UploadFileMouseTrap
                  uploadEmitter={uploadFile.bind(value.socket)()}
                ></UploadFileMouseTrap>
                <MySocket setObject={value.setObject}></MySocket>
                <Nav socket={value.socket}></Nav>
              </div>
            )}
          </SocketContext.Consumer>
        </SocketContext.Provider>
        <Cytoscape socket={myObject.socket}></Cytoscape>
      </Suspense>
    </Mydiv>
  );
}

export { SocketContext };

export default RenderApp;
