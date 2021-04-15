import React, { useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { makeStyles } from "@material-ui/core/styles";
import CommandPalette from "react-command-palette";
import commands from "./paletteCommands.js";
import { MySelect } from "./js/components/myselect.js";
import "./custom.scss";
import { SocketContext } from "./index.js";
import { addNode } from "./emitters";
import PubSub from "pubsub-js";

const drawerWidth = 30;
const drawerStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

function Layouts() {
  const contextValue = useContext(SocketContext);
  return (
    <label>
      {" "}
      Layouts
      <MySelect
        id="layouts"
        //initial_message="Choose a Layout"
        placeholder="Layouts"
        //btPlaceholder="Layouts"
        variant="warning"
        title="Layouts"
        items={contextValue.socket ? contextValue.socket.layouts : []}
        actionTo={(e) => PubSub.publish("toCytoLayout", e)}
      ></MySelect>
    </label>
  );
}

function Graphs() {
  const contextValue = useContext(SocketContext);
  useEffect(() => { }, []);
  return (
    <label>
      {" "}
      Graphs
      <MySelect
        id="graphs"
        placeholder="Graphs"
        variant="warning"
        title="Graphs"
        items={contextValue.socket ? contextValue.socket.subgraphs : []}
        actionTo={(e) => PubSub.publish("showSubgraph", e)}
      ></MySelect>
    </label>
  );
}

function Components() {
  const contextValue = useContext(SocketContext);
  useEffect(() => { }, []);
  return (
    <label>
      {" "}
      Components
      <MySelect
        id="components"
        //drop="right"
        //initial_message="Add a component"
        placeholder="Components"
        //btPlaceholder="Components"
        variant="warning"
        title="Components"
        items={contextValue.socket ? contextValue.socket.components : []}
        actionTo={addNode.bind(contextValue.socket)()}
      ></MySelect>
    </label>
  );
}

function Editors(props) {
  const func = props.func;
  return (
    <label>
      {" "}
      Editors
      <DropdownButton
        id="dropdown-item-button"
        title="Editors"
        menuAlign="right"
      >
        <Dropdown.Item onSelect={func} eventKey="Node Editor">
          Node Editor
        </Dropdown.Item>
        <Dropdown.Item onSelect={func} eventKey="Save/Load">
          Save/Load
        </Dropdown.Item>
        <Dropdown.Item onSelect={func} eventKey="Full Config Editor">
          Full Config Editor
        </Dropdown.Item>
        <Dropdown.Item onSelect={func} eventKey="Pipeline Editor">
          Pipeline Editor
        </Dropdown.Item>
        <Dropdown.Item onSelect={func} eventKey="Defaults Editor">
          Defaults Editor
        </Dropdown.Item>
      </DropdownButton>
    </label>
  );
}

function SwipeableTemporaryDrawer(props) {
  const classes = drawerStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    started: false,
  });

  const toggleDrawer = (open) => (event) => {
    if (
      (event && event.type === "keydown") ||
      (event.type === "click" && (event.key === "Tab" || event.key === "Shift"))
    ) {
      return;
    }
    setState({ ...state, ["left"]: open, ["started"]: true });
  };

  const list = (func) => (
    <div
      role="presentation"
      onClick={toggleDrawer(true)}
      onKeyDown={toggleDrawer(true)}
    >
      <List>
        <ListItem button key="Layouts">
          <Layouts></Layouts>
        </ListItem>
        <ListItem button key="Components">
          <Components></Components>
        </ListItem>
        <ListItem button key="Graphs">
          <Graphs></Graphs>
        </ListItem>
        <ListItem button key="Editors">
          <Editors func={func}></Editors>
        </ListItem>
      </List>
    </div>
  );
  if (state["started"]) {
    return (
      <div>
        <Button variant="warning" onClick={toggleDrawer(true)}>
          Menu
        </Button>
        <CommandPalette
          commands={commands}
          resetInputOnClose="true"
          closeOnSelect="true"
        />

        <SwipeableDrawer
          anchor="left"
          open={state["left"]}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          {list(props.func)}
        </SwipeableDrawer>
      </div>
    );
  } else {
    return (
      <div>
        <Button variant="warning" onClick={toggleDrawer(true)}>
          Menu
        </Button>
        <CommandPalette
          commands={commands}
          resetInputOnClose="true"
          closeOnSelect="true"
        />
      </div>
    );
  }
}

const MyDrawer = (props) => {
  const func = props.func;
  return (
    <SwipeableTemporaryDrawer
      anchor="left"
      open={true}
      // onClose={toggleDrawer("left", false)}
      // onOpen={toggleDrawer("left", true)}
      func={func}
      commands={commands}
    ></SwipeableTemporaryDrawer>
  );
};

export default MyDrawer;
