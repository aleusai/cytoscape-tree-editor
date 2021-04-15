import React, { lazy, useState, useEffect, Suspense, useContext } from "react";
import * as ace from "ace-builds/src-min-noconflict/ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-searchbox";
import Draggable from "react-draggable";
import { addPipeline } from "../../emitters";
import { SocketContext } from "./../../index.js";

const MyAceClone = lazy(() => import("./myaceClone"));

function PipelineEditor(props) {
  const contextValue = useContext(SocketContext);
  const [myObject, setObject] = useState({
    zIndex: 1000
  });
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
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Draggable handle="strong" zindex={myObject.zIndex}>
        <div style={{ position: 'relative', zIndex: myObject.zIndex }}>
          <strong>
            {" "}
            <p className="cursor" style={{ color: "red" }}>
              Drag me
            </p>
          </strong>
          <MyAceClone
            components={
              contextValue.socket ? contextValue.socket.components : []
            }
            pipelines={contextValue.socket ? contextValue.socket.pipelines : []}
            actionTo={addPipeline.bind(contextValue.socket)()}
            mytheme="solarized_light"
            mymode="json"
            myname="EditorPipeline1"
            variant="warning"
            // btPlaceholder="Pipelines"
            placeholder="Pipelines"
            myfunc={(a) => {
              return [a];
            }}
            width="40em"
            height="10em"
            // opacity="0"
            noSplit="true"
          ></MyAceClone>
        </div>
      </Draggable>
    </Suspense>
  );
}

export default PipelineEditor;
