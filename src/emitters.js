/*  Emitters */
//import { socket} from "././js/components/core.js";
import PubSub from "pubsub-js";


export function addNode() {
  // doesn't wotk with es6 -> console.log('CALLER IS', addNode.caller());
  if (this) {
    return (e) =>
    PubSub.publish("addNode", e);
  }
  return () => { };
}

export function editNode() {
  if (this) {
    return (e) => 
    PubSub.publish("editNode", e);
  }
  return () => { };
}

export function addPipeline() {
  if (this) {
    return (e) => PubSub.publish("addPipeline", e);
  }
  return () => { };
}


export function getStartupDefaults() {
  if (this) {
    this["defaults"] = this["initial_defaults"];
    return (e) =>
      this.emit("getStartupDefaults", {
        action: "getStartupDefaults",
        content: "",
      });
  }
  return () => { };
}

export const cloneNode = (item, source, target) => {
  socket.emit("my event", {
    action: "cloneNode",
    content: [item.data()["id"], item.data()["Node_Type"], source, target],
  });
};

export const deleteNodes = (deletedElements, channel) => {
  socket.emit("my event", {
    action: "deleteNode",
    content: [deletedElements, { answer: channel }],
  });
};

export function forward() {
  if (this) {
    return () =>
      this.emit("my event", {
        action: "forward",
        content: true,
      });
  }
  return () => { };
}

export function backward() {
  if (this) {
    return () =>
      this.emit("my event", {
        action: "backward",
        content: true,
      });
  }
  return () => { };
}
