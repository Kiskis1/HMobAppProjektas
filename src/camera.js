import React, { Component } from "react";
import { StyleSheet } from "react-native";

import firestore from "@react-native-firebase/firestore";
import { CameraKitCameraScreen } from "react-native-camera-kit";

import Ajv from "ajv";

const SCHEMA = {
  definitions: {},
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/root.json",
  type: "string",
  title: "The Root Schema",
  required: ["svoris", "kaina", "pirkimodata"],
  properties: {
    svoris: {
      $id: "#/properties/svoris",
      type: "integer",
      title: "The Svoris Schema",
      default: 0,
      examples: [321]
    },
    kaina: {
      $id: "#/properties/kaina",
      type: "integer",
      title: "The Kaina Schema",
      default: 0,
      examples: [123]
    },
    pirkimodata: {
      $id: "#/properties/pirkimodata",
      type: "string",
      title: "The Pirkimodata Schema",
      default: "",
      examples: ["2019-12-24"],
      pattern: "^(.*)$"
    }
  }
};

export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      scanned: false
    };
  }

  componentWillMount() {
    this.setState({ scanned: false });
  }

  validate = json => {
    var ajv = new Ajv({ schemaId: "auto" });
    var valid = ajv.validate(SCHEMA, json);
    if (valid) {
      console.log("VALIDASASDSDGSA");
      return true;
    } else {
      console.log("INVALIDASDASDASD");
      console.log(ajv.errorsText());
      return false;
    }
  };

  sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  scanKoda = event => {
    if (!this.state.scanned) {
      if (this.validate(event.nativeEvent.codeStringValue)) {
        let object = JSON.parse(event.nativeEvent.codeStringValue);
        let docId = "";
        console.log(event.nativeEvent.codeStringValue);
        console.log(object.kaina);
        firestore()
          .collection("scanned")
          .doc()
          .set(object);
        this.setState({ scanned: true });
        firestore()
          .collection("prekes")
          .where("kaina", "==", object.kaina)
          .where("svoris", "==", object.svoris)
          .where("pirkimodata", "==", object.pirkimodata)
          .get()
          .then(snapshot => {
            snapshot.docs.forEach(doc => {
              docId = doc.id;
              console.log(doc.id);
            });
          });
        console.log(docId);
        this.sleep(5000).then(() => {
          firestore()
            .collection("prekes")
            .doc(docId)
            .update({ skenuotas: true });
        });
      }
      this.props.navigation.goBack();
    }
  };

  render() {
    return (
      <CameraKitCameraScreen
        scanBarcode={true}
        laserColor={"blue"}
        frameColor={"yellow"}
        //onReadCode={event => Alert.alert("Qr code found")} //optional
        onReadCode={event => this.scanKoda(event)}
        hideControls={false} //(default false) optional, hide buttons and additional controls on top and bottom of screen
        showFrame={true} //(default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
        offsetForScannerFrame={10} //(default 30) optional, offset from left and right side of the screen
        heightForScannerFrame={300} //(default 200) optional, change height of the scanner frame
        colorForScannerFrame={"red"} //(default white) optional, change colot of the scanner frame
      />
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 15
  },
  cameraa: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  }
});
