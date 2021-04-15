import React, { useState, useEffect } from "react";
//import AceEditor from "react-ace";
import { split as SplitEditor } from "react-ace/dist/react-ace.min.js";
//import SplitAceEditor from "react-ace";
import ace from "ace-builds/src-min-noconflict/ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-searchbox";
//import PubSub from "pubsub-js";
import Button from "react-bootstrap/Button";
//import Tooltip from '@material-ui/core/Tooltip';

function SplitEditor_(props, myObject, onChange) {
  return (
    <SplitEditor
      onLoad={(editorInstance) => {
        editorInstance.$container.style.resize = "both";
        // mouseup = css resize end
        document.addEventListener("mouseup", (e) => editorInstance.resize());
      }}
      value={myObject.value}
      keyEditor={props.keyEditor}
      splits={myObject.active == "A" ? 1 : 2}
      setOptions={{
        useWorker: false,
      }}
      mode={props.mymode}
      theme={props.mytheme || "solarized_light"}
      name={props.myname}
      myfunc={
        props.myfunc ||
        ((a) => {
          return [a];
        })
      }
      hasCssTransforms="true"
      setUseSoftTabs="true"
      showInvisibles="true"
      onChange={onChange}
      editorProps={{
        $blockScrolling: true,
      }}
      width={props.width || "60em"}
      height={props.height || "40em"}
    />
  );
}

function MyAceDefaults(props) {
  /*  Default active value is 'B' so as to set the mode for both 
        editors' windows correctly
      */
  const [myObject, setObject] = useState({
    dimensions: {
      editorHeight: 400,
      editorWidth: "auto",
    },
    value: [],
    active: "B",
  });

  useEffect((myObject) => {
    var jstr =
      typeof props.refreshed != "string"
        ? JSON.stringify(props.refreshed, null, 4)
        : props.refreshed;
    setObject({ ...myObject, value: [jstr, jstr] });
  }, []);

  function onChange(newValue) {
    if (newValue.length == 2) {
      var value =
        JSON.stringify(newValue[0]) === JSON.stringify(myObject.value[0])
          ? [newValue[1], newValue[1]]
          : [newValue[0], newValue[0]];
    } else {
      let newValue_0 = newValue[0] ? newValue[0] : "";
      let newValue_1 = newValue[1] ? newValue[1] : "";
      var value = [newValue_0, newValue_1];
    }

    setObject({ ...myObject, value: value });
  }

  function funcSubmit(e) {
    if (myObject.value[0]) props.actionTo(myObject.value[0]);
  }

  function onClickSplit() {
    if (myObject.active == "B") {
      setObject({ ...myObject, active: "A" });
    } else {
      setObject({ ...myObject, active: "B" });
    }
  }

  function getItitialDefaults() {
    props.actionToStartup;
  }

  let myButton;
  if (props.noSplit !== undefined && props.noSplit === "true") {
    myButton = <div> </div>;
  } else {
    myButton = <Button onClick={onClickSplit}> Split </Button>;
  }
  return (
    <div
      className="overflow: auto;
        resize: both; height: 400 px; width: auto;
        "
      style={{ zIndex: 0 }}
    >
      {myButton}{" "}
      <Button variant="dark" onClick={getItitialDefaults}>
        {" "}
        {props.buttonText}{" "}
      </Button>{" "}
      <Button variant="dark" onClick={funcSubmit}>
        {" "}
        Editor Submit{" "}
      </Button>{" "}
      <div
        className="overflow: auto;
        resize: both; height: 400 px; width: auto;
        "
      >
        {" "}
        {SplitEditor_(props, myObject, onChange)}
      </div>{" "}
    </div>
  );
}

export default MyAceDefaults;
