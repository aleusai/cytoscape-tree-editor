import React, { lazy, useState, Suspense, useContext, useEffect } from "react";
import * as ace from "ace-builds/src-min-noconflict/ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-searchbox";
import Draggable from "react-draggable";
import { editNode } from "../../emitters";
import {
  mouseOver,
  click,
  editedNode,
  unsubscribe,
} from "../../eventListeners";
import { SocketContext } from "../../index.js";
import { cyan } from "@material-ui/core/colors";

const MyAce = lazy(() => import("./myace"));

function NodeEditor(props) {
  const contextValue = useContext(SocketContext);
  const [myObject, setObject] = useState({
     zIndex: 1000 });

  useEffect(() => { 
    var Mousetrap = require("mousetrap");
    Mousetrap.bind(["command+o", "ctrl+o"], function () {
      setObject((myObject) => { 
        if (myObject.zIndex < 0) {
          return { ...myObject, zIndex: 1000 } 
      }
      else {
        return { ...myObject, zIndex: -1000 } 
      }
    });
  });
  return function cleanup() {
    Mousetrap.unbind(["command+o", "ctrl+o"]);
  };
  }, [myObject])

  return (
    <Draggable handle="strong" zindex={myObject.zIndex}>
      <div style={{position: 'relative', zIndex: myObject.zIndex}}>
        <strong>
          {" "}
          <p className="cursor" style={{ color: "red" }}>
            Drag me
          </p>
        </strong>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <MyAce
              mytheme="solarized_light"
              mymode="json"
              myname="EditorNew1"
              listenerMouseOver={(e) => mouseOver(e)}
              listenerClick={(e) => click(e)}
              listenerEditedNode={(e) => editedNode(e)}
              unsubscribe={(e) => unsubscribe(e)}
              actionTo={editNode.bind(contextValue.socket)()}
              width="60em"
              height="25em"
            ></MyAce>
          </Suspense>
        </div>
      </div>
    </Draggable>
  );
}

const NodeEditor_ = () => {
  return <div></div>;
};

export default NodeEditor;
