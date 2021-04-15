import React, { useEffect, useRef, useState } from "react";
import * as ace from "ace-builds/src-min-noconflict/ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-searchbox";
import PubSub from "pubsub-js"
import Draggable from "react-draggable";
import Button from "react-bootstrap/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Mydiv from "./mydiv";

function backward() {
  console.log("backward");
  PubSub.publish("socket.in.backward", "backward");
}

function forward() {
  console.log("forward");
  PubSub.publish("socket.in.forward", "forward");
}

function UploadFile(props) {
  const fileRef = useRef();

  function uploadFile(e) {
    let file = e.target.files[0];
    console.log("Uploading file:", e.target.files);
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (e) {
        if (props.uploadTo) props.uploadTo(reader.result);
      };
    }
    console.log('Finished uploading');
  }

  function onClick(e) {
    fileRef.current.click();
  }

  return (
    <Button variant="warning" onClick={onClick}>
      Upload
      <input
        type="file"
        name="fileName"
        onChange={uploadFile}
        ref={fileRef}
        style={{ display: "none" }}
      />
    </Button>
  );
}

function SaveFile(props) {
  const [myObject, setObject] = useState({
    filename: "config" + Date.now() + ".json",
  });

  function onClick(e) {
    console.log("Saving file:", myObject.filename);
    var blob = new Blob([props.jsonFile], {
      type: "text/plain;charset=utf-8",
    });

    console.log("Saving to file SAVELOAD ", myObject.filename);
    saveAs(blob, myObject.filename);
  }

  return (
    <Tooltip title={"Saving to config<timestamp>.json"}>
      <Mydiv>
        <Button variant="warning" onClick={onClick}>
          Save
        </Button>
      </Mydiv>
    </Tooltip>
  );
}

function SaveLoad(props) {
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
    <Draggable handle="strong" zindex={myObject.zIndex}>
      <div style={{ position: 'relative', zIndex: myObject.zIndex }}>
        <strong>
          {" "}
          <p className="cursor" style={{ color: "red" }}>
            Drag me
          </p>
        </strong>
        <Mydiv>
          <Button onClick={props.backward}> Backward </Button>
          <Button onClick={props.forward}> Forward </Button>

          <UploadFile uploadTo={props.uploadTo} />
          <SaveFile jsonFile={props.save} />
        </Mydiv>
      </div>
    </Draggable>
  );
}

export default SaveLoad;
