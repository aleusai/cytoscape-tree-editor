import React, { useState } from "react";
//import AceEditor from "react-ace";
//import { split as SplitEditor } from "react-ace/dist/react-ace.min.js";
import { split as SplitEditor } from "react-ace";
import ace from "ace-builds/src-min-noconflict/ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-searchbox";
//import PubSub from "pubsub-js";
import Button from "react-bootstrap/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { MySelect, MultipleSelect } from "./myselect.js";
import Mydiv from "./mydiv.js";

const Option = (props) => {
  return (
    <Tooltip
      title={
        <h3 style={{ color: "lightblue" }}>{JSON.stringify(props.value)}</h3>
      }
    >
      <span>
        <components.Option {...props} />
      </span>
    </Tooltip>
  );
};

const ControlComponent = (props) => {
  return (
    <Button variant={props.selectProps.variant}>
      <components.Control {...props} />
    </Button>
  );
};

function MyAceClone(props) {
  const [myObject, setObject] = useState({
    value: props.initialValue,
    editor: {
      value: [],
    },
    node: [],
    node2: [],
  });

  function onSelect(e, b) {
    for (let item of b) {
      if (item["value"] == e) {
        var value = item["label"].split(" ");
      }
    }
    if (e == "Clear") {
      var value = [];
    } else {
      var value = myObject.node.concat(value);
    }

    setObject({
      ...myObject,
      value: myObject.value,
      node: value,
      node2: myObject.node2,
    });
  }

  function onSelect2(e) {
    console.log("ON SELECT 2:", e);
    setObject({
      ...myObject,
      value: myObject.value,
      state: myObject.active,
      node: myObject.node,
      node2: e,
    });
  }
  function onChange(newValue) {
    setObject({
      ...myObject,
      editor: {
        value: newValue,
      },
    });
  }

  function funcSubmit(e) {
    // null/undefined safe concat
    const components = [...(myObject.node || []), ...(myObject.node2 || [])];
    console.log(
      "FUNC SUBMIT PIPELINE:",
      myObject.editor.value[0].split(","),
      components,
      myObject.node2
    );
    if (
      components.length &&
      props.actionTo !== undefined &&
      myObject.editor.value[0] !== undefined
    ) {
      props.actionTo([myObject.editor.value[0].split(","), components]);
    }
  }

  return (
    <div>
      <Mydiv>
        <Button variant="dark" onClick={funcSubmit}>
          Editor Submit
        </Button>
        <MySelect
          variant={props.variant}
          placeholder={props.placeholder}
          components={{ Option: Option, Control: ControlComponent }}
          title={props.dropdownTitle}
          items={props.pipelines}
          actionTo=""
          clear="true"
          callbackParentOptions={onSelect}
        ></MySelect>
        <MultipleSelect
          //drop="right"
          //initial_message="Add a component"
          placeholder="Components"
          title="Components"
          items={props.components}
          callbackParent={onSelect2}
        ></MultipleSelect>
      </Mydiv>
      <Tooltip
        title={"Enter the pipelines names array (names separated by a comma)"}
      >
        <div>
          <SplitEditor
            onLoad={(editorInstance) => {
              editorInstance.$container.style.resize = "both";
              // mouseup = css resize end
              document.addEventListener("mouseup", (e) =>
                editorInstance.resize()
              );
            }}
            value={myObject.editor.value}
            keyEditor={props.keyEditor}
            splits={1}
            setOptions={{
              useWorker: false,
            }}
            mode={props.mymode || "json"}
            theme={props.mytheme || "solarized_light"}
            name={props.myname}
            hasCssTransforms="true"
            setUseSoftTabs="true"
            showInvisibles="true"
            onChange={onChange}
            editorProps={{
              $blockScrolling: true,
            }}
            width={props.width || "20em"}
            height={props.height || "20em"}
          />{" "}
        </div>
      </Tooltip>
    </div>
  );
}

/* **** */

export default MyAceClone;
