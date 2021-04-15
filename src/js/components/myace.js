import React, { useEffect, useState } from "react";
import { split as SplitEditor } from "react-ace";
//import { split as SplitEditor } from "react-ace/dist/react-ace.min.js";
import ace from "ace-builds/src-min-noconflict/ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-searchbox";
//import PubSub from "pubsub-js";
import Button from "react-bootstrap/Button";
//import { unsubscribe } from "pubsub-js";

function MyAce(props) {
  /*  Default active value is 'B' so as to set the mode for both 
        editors' windows correctly
      */
  //static contextType = SocketContext;
  const [myObject, setObject] = useState({
    zIndex: 1000000,
    dimensions: {
      editorHeight: 400,
      editorWidth: "auto",
    },
    value: [],
    active: "B",
  });

  useEffect(() => {

    function mouseOver(nodeData) {
      var jstr =
        typeof nodeData != "string" ? JSON.stringify(nodeData, null, 4) : data;

      setObject((myObject) => {
        if (typeof myObject.value[1] != "undefined") {
          return {
            ...myObject,
            value: [jstr, myObject.value[1]],
          };
        } else {
          return { ...myObject, value: [jstr] };
        }
      });
    }
    const tokenMouseOver = props.listenerMouseOver(mouseOver);

    function nodeClick(nodeData) {
      var jstr =
        typeof nodeData != "string"
          ? JSON.stringify(nodeData, null, 4)
          : nodeData;
      if (myObject.active == "B") {
        setObject((myObject) => ({
          ...myObject,
          value: [myObject.value[0], jstr],
        }));
      }
    }
    const tokenClick = props.listenerClick(nodeClick);

    function nodeEdit(editedNodeData) {
      var jstr = editedNodeData;
      var value_0 =
        myObject.value[0].length > 0 &&
        jstr["id"] == JSON.parse(myObject.value[0])["id"]
          ? JSON.stringify(jstr, null, 4)
          : myObject.value[0];
      var value_1 =
        myObject.value[1].length > 0 &&
        jstr["id"] == JSON.parse(myObject.value[1])["id"]
          ? JSON.stringify(jstr, null, 4)
          : myObject.value[1];
      setObject((myObject) => ({ ...myObject, value: [value_0, value_1] }));
    }
    const tokenEditedNode = props.listenerEditedNode(nodeEdit);

    function unmountUnsubscribe() {
      props.unsubscribe(tokenMouseOver);
      props.unsubscribe(tokenClick);
      props.unsubscribe(tokenEditedNode);
    }
    return unmountUnsubscribe;
  }, [myObject]);

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
    if (myObject.value[1]) props.actionTo(myObject.value[1]);
  }

  function onClickSplit() {
    if (myObject.active == "B") {
      setObject({ ...myObject, active: "A" });
    } else {
      setObject({ ...myObject, active: "B" });
    }
  }

  let myButton;
  if (props.noSplit !== undefined && props.noSplit === "true") {
    myButton = <div> </div>;
  } else {
    myButton = <Button onClick={onClickSplit}> Split </Button>;
  }
  let zIndex = myObject.zIndex;
  return (
    <div
      className="overflow: auto;
        resize: both; height: 400 px; width: auto;
        "
      style={{ position: 'relative', zIndex: zIndex }}
    >
      {myButton}{" "}
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
        <SplitEditor
          onLoad={(editorInstance) => {
            editorInstance.$container.style.resize = "both";
            // mouseup = css resize end
            document.addEventListener("mouseup", (e) =>
              editorInstance.resize()
            );
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
          hasCssTransforms="true"
          setUseSoftTabs="true"
          showInvisibles="true"
          onChange={onChange}
          editorProps={{
            $blockScrolling: true,
          }}
          width={props.width || "60em"}
          height={props.height || "40em"}
        />{" "}
      </div>{" "}
    </div>
  );
}

export default MyAce;
