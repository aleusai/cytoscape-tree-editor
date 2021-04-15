import React, { useState, useEffect } from "react";
//import PubSub from "pubsub-js";
import Tooltip from "@material-ui/core/Tooltip";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "@material-ui/core/Select";
//import { makeStyles, useTheme, styled } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
//import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Button from "react-bootstrap/Button";

function MySelect(props) {
  const [myObject, setObject] = useState({
    title: props.placeholder,
    style: {},
    options: [
      {
        label: "clear",
        value: "clear",
      },
    ],
  });

  useEffect(() => {
    let data = props.items;
    if (data) {
      let _list =
        !(data.constructor == Object) && Array.isArray(data)
          ? data.map((x, index) => ({
            value: x,
            label: x,
          }))
          : Object.keys(data).map((x, index) =>
            Array.isArray(data[x])
              ? {
                value: x,
                label: data[x].join(" "),
              }
              : {
                value: x,
                label: x,
              }
          );
      setObject({ ...myObject, options: _list });
    }
  }, []);

  function onSelect(e, b) {
    if (props.callbackParentOptions && e)
      props.callbackParentOptions(e, myObject.options);
    if (props.actionTo) props.actionTo(e);

    if (e == "Clear") {
      setObject({ ...myObject, title: props.placeholder });
    } else {
      setObject({ ...myObject, title: e });
    }
  }

  let Clear;
  if (props.clear) {
    Clear = (
      <Tooltip title={<h3 style={{ color: "lightblue" }}>Unselect</h3>}>
        <Dropdown.Item onSelect={onSelect} eventKey="Clear">
          "Clear"
        </Dropdown.Item>
      </Tooltip>
    );
  } else {
    Clear = <div></div>;
  }
  return (
    <div>
      <DropdownButton
        variant={props.variant}
        id={props.id}
        title={myObject.title}
        menuAlign={props.axis}
      >
        {Clear}
        {myObject.options.map((x, _index) => {
          let value = x.value;
          let label = x.label;
          return (
            /* There is a bug in material ui so that we get the warning:
                 react.development.js:220 Warning: Failed prop type: Material-UI: 
                 The `anchorEl` prop provided to the component is invalid
              */
            <Tooltip
              key={value}
              title={
                <h3 style={{ color: "lightblue" }}>{JSON.stringify(label)}</h3>
              }
            >
              <Dropdown.Item key={value} onSelect={onSelect} eventKey={value}>
                {value}
              </Dropdown.Item>
            </Tooltip>
          );
        })}
      </DropdownButton>
    </div>
  );
}

/* ****************** */

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function MultipleSelect(props) {
  const [myObject, setObject] = useState({
    componentName: [],
    components: props.items ? props.items : [],
  });

  function handleChange(event) {
    if (props.callbackParent && event) props.callbackParent(event.target.value);
    setObject({ ...myObject, componentName: event.target.value });
  }

  return (
    <div>
      <Box pr={10}>
        <FormControl>
          <Button variant="warning">Components</Button>
          <Select
            style={{ maxWidth: 120 }}
            labelId="demo-mutiple-name-label"
            id="demo-mutiple-name"
            multiple
            value={myObject.componentName}
            onChange={handleChange}
            // input={<Input />}
            MenuProps={MenuProps}
          >
            {myObject.components.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}

export { MySelect, MultipleSelect };
