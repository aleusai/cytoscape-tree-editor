(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./src/js/components/myace.js":
/*!************************************!*\
  !*** ./src/js/components/myace.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_ace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-ace */ "./node_modules/react-ace/lib/index.js");
/* harmony import */ var react_ace__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_ace__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ace_builds_src_min_noconflict_ace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ace-builds/src-min-noconflict/ace */ "./node_modules/ace-builds/src-min-noconflict/ace.js");
/* harmony import */ var ace_builds_src_min_noconflict_ace__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ace_builds_src_min_noconflict_ace__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ace_builds_webpack_resolver__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ace-builds/webpack-resolver */ "./node_modules/ace-builds/webpack-resolver.js");
/* harmony import */ var ace_builds_webpack_resolver__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ace_builds_webpack_resolver__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ace_builds_src_noconflict_mode_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ace-builds/src-noconflict/mode-json */ "./node_modules/ace-builds/src-noconflict/mode-json.js");
/* harmony import */ var ace_builds_src_noconflict_mode_json__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ace_builds_src_noconflict_mode_json__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ace_builds_src_noconflict_theme_solarized_light__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ace-builds/src-noconflict/theme-solarized_light */ "./node_modules/ace-builds/src-noconflict/theme-solarized_light.js");
/* harmony import */ var ace_builds_src_noconflict_theme_solarized_light__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ace_builds_src_noconflict_theme_solarized_light__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ace_builds_src_noconflict_ext_searchbox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ace-builds/src-noconflict/ext-searchbox */ "./node_modules/ace-builds/src-noconflict/ext-searchbox.js");
/* harmony import */ var ace_builds_src_noconflict_ext_searchbox__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ace_builds_src_noconflict_ext_searchbox__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-bootstrap/Button */ "./node_modules/react-bootstrap/esm/Button.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


 //import { split as SplitEditor } from "react-ace/dist/react-ace.min.js";





 //import PubSub from "pubsub-js";

 //import { unsubscribe } from "pubsub-js";

function MyAce(props) {
  /*  Default active value is 'B' so as to set the mode for both 
        editors' windows correctly
      */
  //static contextType = SocketContext;
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({
    zIndex: 1000000,
    dimensions: {
      editorHeight: 400,
      editorWidth: "auto"
    },
    value: [],
    active: "B"
  }),
      _useState2 = _slicedToArray(_useState, 2),
      myObject = _useState2[0],
      setObject = _useState2[1];

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    function mouseOver(nodeData) {
      var jstr = typeof nodeData != "string" ? JSON.stringify(nodeData, null, 4) : data;
      setObject(function (myObject) {
        if (typeof myObject.value[1] != "undefined") {
          return _objectSpread(_objectSpread({}, myObject), {}, {
            value: [jstr, myObject.value[1]]
          });
        } else {
          return _objectSpread(_objectSpread({}, myObject), {}, {
            value: [jstr]
          });
        }
      });
    }

    var tokenMouseOver = props.listenerMouseOver(mouseOver);

    function nodeClick(nodeData) {
      var jstr = typeof nodeData != "string" ? JSON.stringify(nodeData, null, 4) : nodeData;

      if (myObject.active == "B") {
        setObject(function (myObject) {
          return _objectSpread(_objectSpread({}, myObject), {}, {
            value: [myObject.value[0], jstr]
          });
        });
      }
    }

    var tokenClick = props.listenerClick(nodeClick);

    function nodeEdit(editedNodeData) {
      var jstr = editedNodeData;
      var value_0 = myObject.value[0].length > 0 && jstr["id"] == JSON.parse(myObject.value[0])["id"] ? JSON.stringify(jstr, null, 4) : myObject.value[0];
      var value_1 = myObject.value[1].length > 0 && jstr["id"] == JSON.parse(myObject.value[1])["id"] ? JSON.stringify(jstr, null, 4) : myObject.value[1];
      setObject(function (myObject) {
        return _objectSpread(_objectSpread({}, myObject), {}, {
          value: [value_0, value_1]
        });
      });
    }

    var tokenEditedNode = props.listenerEditedNode(nodeEdit);

    function unmountUnsubscribe() {
      props.unsubscribe(tokenMouseOver);
      props.unsubscribe(tokenClick);
      props.unsubscribe(tokenEditedNode);
    }

    return unmountUnsubscribe;
  }, [myObject]);

  function onChange(newValue) {
    if (newValue.length == 2) {
      var value = JSON.stringify(newValue[0]) === JSON.stringify(myObject.value[0]) ? [newValue[1], newValue[1]] : [newValue[0], newValue[0]];
    } else {
      var newValue_0 = newValue[0] ? newValue[0] : "";
      var newValue_1 = newValue[1] ? newValue[1] : "";
      var value = [newValue_0, newValue_1];
    }

    setObject(_objectSpread(_objectSpread({}, myObject), {}, {
      value: value
    }));
  }

  function funcSubmit(e) {
    if (myObject.value[0]) props.actionTo(myObject.value[0]);
    if (myObject.value[1]) props.actionTo(myObject.value[1]);
  }

  function onClickSplit() {
    if (myObject.active == "B") {
      setObject(_objectSpread(_objectSpread({}, myObject), {}, {
        active: "A"
      }));
    } else {
      setObject(_objectSpread(_objectSpread({}, myObject), {}, {
        active: "B"
      }));
    }
  }

  var myButton;

  if (props.noSplit !== undefined && props.noSplit === "true") {
    myButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, " ");
  } else {
    myButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_7__["default"], {
      onClick: onClickSplit
    }, " Split ");
  }

  var zIndex = myObject.zIndex;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "overflow: auto; resize: both; height: 400 px; width: auto; ",
    style: {
      position: 'relative',
      zIndex: zIndex
    }
  }, myButton, " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_7__["default"], {
    variant: "dark",
    onClick: funcSubmit
  }, " ", "Editor Submit", " "), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "overflow: auto; resize: both; height: 400 px; width: auto; "
  }, " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_ace__WEBPACK_IMPORTED_MODULE_1__["split"], {
    onLoad: function onLoad(editorInstance) {
      editorInstance.$container.style.resize = "both"; // mouseup = css resize end

      document.addEventListener("mouseup", function (e) {
        return editorInstance.resize();
      });
    },
    value: myObject.value,
    keyEditor: props.keyEditor,
    splits: myObject.active == "A" ? 1 : 2,
    setOptions: {
      useWorker: false
    },
    mode: props.mymode,
    theme: props.mytheme || "solarized_light",
    name: props.myname,
    hasCssTransforms: "true",
    setUseSoftTabs: "true",
    showInvisibles: "true",
    onChange: onChange,
    editorProps: {
      $blockScrolling: true
    },
    width: props.width || "60em",
    height: props.height || "40em"
  }), " "), " ");
}

/* harmony default export */ __webpack_exports__["default"] = (MyAce);

/***/ })

}]);
//# sourceMappingURL=1.js.map