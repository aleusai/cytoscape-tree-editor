import React, { Component } from "react";
//import PubSub from "pubsub-js"

class UploadFileMouseTrap extends Component {
  constructor(props) {
    super(props);
    this.fileRef = React.createRef();
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    let mythis = this;
    var Mousetrap = require("mousetrap");
    Mousetrap.bind(["command+u", "ctrl+u"], function () {
      mythis.fileRef.current.click();
    });
  }

  uploadFile(e) {
    let file = e.target.files[0];
    let mythis = this;
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (e) {
        this.props.uploadEmitter(reader.result);
      }.bind(mythis);
    }
  }

  render() {
    let mythis = this;
    return (
      <input
        type="file"
        name="fileName"
        onChange={mythis.uploadFile}
        ref={this.fileRef}
        style={{
          display: "none",
        }}
      />
    );
  }
}

export default UploadFileMouseTrap;
