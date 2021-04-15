import React, { lazy, useState, useEffect, Suspense } from "react";
import * as ace from "ace-builds/src-min-noconflict/ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-searchbox";
import Draggable from "react-draggable";
import Mydiv from "./mydiv";
import { updateDefault, getStartupDefaults } from "../../emitters";
import { SocketContext } from "./../../index.js";

const MyAceDefaults = lazy(() => import("./myaceDefaults"));

const DefaultsEditor = () => {
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
  }, []);
  return (
    <Draggable handle="strong" zindex={myObject.zIndex}>
      <div style={{position: 'relative', zIndex: myObject.zIndex}}>
        <strong>
          {" "}
          <p className="cursor" style={{ color: "red" }}>
            Drag me
          </p>
        </strong>
        <Mydiv>
          <Suspense fallback={<div>Loading...</div>}>
            <SocketContext.Consumer>
              {(value) => (
                <MyAceDefaults
                  refreshed={value.socket ? value.socket["defaults"] : ""}
                  startupData={
                    value.socket ? value.socket["initial_defaults"] : ""
                  }
                  buttonText="Get startup Defaults"
                  placeholder="Vi editor of the Defaults"
                  actionTo={updateDefault.bind(value.socket)()}
                  actionToStartup={getStartupDefaults.bind(value.socket)()}
                  mytheme="solarized_light"
                  mymode="json"
                  myname="EditorNew3"
                  // opacity="0"
                  myfunc={(a) => {
                    return [a];
                  }}
                  //width="60em"
                  //height="20em"
                ></MyAceDefaults>
              )}
            </SocketContext.Consumer>
          </Suspense>{" "}
        </Mydiv>
      </div>
    </Draggable>
  );
};

export default DefaultsEditor;
