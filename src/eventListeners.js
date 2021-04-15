/* Event listeners */

import PubSub from "pubsub-js";

export const unsubscribe = (t) => {
  PubSub.unsubscribe(t);
};

export const mouseOver = (f) => {
  function mySubscriber(msg, data) {
    f(data);
  }
  const tokenMouseover = PubSub.subscribe("socket.out.mouseOver", mySubscriber);
  return tokenMouseover;
};

export const click = (f) => {
  function mySubscriber(msg, data) {
    f(data);
  }
  const tokenClick = PubSub.subscribe("socket.out.click", mySubscriber);
  return tokenClick;
};

export const tap = (f) => {
  function mySubscriber(msg, data) {
    f(data);
  }
  const tokenTap = PubSub.subscribe("socket.out.tap", mySubscriber);
  return tokenTap;
};

export const editedNode = (f) => {
  function mySubscriber(msg, data) {
    f(data);
  }
  const tokenEditedNode = PubSub.subscribe(
    "socket.out.new_edited_node",
    mySubscriber
  );
  return tokenEditedNode;
};

export const createRaw = (f) => {
  function mySubscriber(msg, data) {
    f(data);
  }
  const tokenCreateRaw = PubSub.subscribe("socket.out.createRaw", mySubscriber);
  return tokenCreateRaw;
};

export const getRaw = (f) => {
  console.log('getRaw');
  function mySubscriber(msg, data) {
    console.log('getRaw2', data);
    f(data);
  }
  const tokenGetRaw = PubSub.subscribe("fromSocket.getRaw", mySubscriber);
  return tokenGetRaw;
};
