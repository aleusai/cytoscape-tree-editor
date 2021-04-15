import React, { useContext, lazy, Suspense } from "react";
import * as ace from "ace-builds/src-min-noconflict/ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-searchbox";
import Draggable from "react-draggable";
import { uploadFile } from "../../emitters";
import { SocketContext } from "../../index.js";
import { getRaw, unsubscribe } from "../../eventListeners";

const MyAceJson = lazy(() => import("./myaceJson"));

function fullConfigEditor(props) {
  const contextValue = useContext(SocketContext);
  return (
    <Draggable handle="strong">
      <div>
        <strong>
          {" "}
          <p className="cursor" style={{ color: "red" }}>
            Drag me
          </p>
        </strong>
        <Suspense fallback={<div>Loading...</div>}>
          <MyAceJson
            refreshButtonText="Get Raw Config"
            placeholder="Vi editor of the full Json config"
            listener={(e) => getRaw(e)}
            publisher={(e) => PubSub.publish("toSocket.getRaw", "")}
            unsubscribe={(e) => unsubscribe(e)}
            emitter={uploadFile.bind(contextValue.socket)()}
            mytheme="solarized_light"
            mymode="json"
            myname="EditorNew3"
            // opacity="0"
            myfunc={(a) => {
              return [a];
            }}
          ></MyAceJson>
        </Suspense>{" "}
      </div>
    </Draggable>
  );
}

export default fullConfigEditor;
