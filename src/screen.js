import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Image,
  RefreshControl
} from "react-native";

import firestore from "@react-native-firebase/firestore";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import DatePicker from "react-native-datepicker";

import Camera from "./camera.js";


class Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false,
      date: "2019-12-24"
    };
  }

  componentWillMount() {
    this.retrieveData();
    //this.testadata();
  }

  retrieveData = () => {
    const list = [];
    firestore()
      .collection("prekes")
      .where("pirkimodata", "==", this.state.date)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          list.push({
            kaina: doc.data().kaina,
            skenuotas: doc.data().skenuotas,
            pirkimodata: doc.data().pirkimodata,
            svoris: doc.data().svoris,
            docId: doc.id
          });
        });
        this.setState({ data: list });
      });
  };

  testadata = () => {
    firestore()
      .collection("prekes")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          console.log(JSON.stringify(doc.data()));
        });
      });
  };

  renderItem = ({ item }) => {
    return (
      <View style={styles.flatlistContainer}>
        <View style={[styles.flatlistStyle, styles.setBorderRadius]}>
          <View style={[{ flex: 2, padding: 5 }]}>
            <Text style={styles.info}>Kaina: {item.kaina}</Text>
            <Text style={styles.info}>Pirkimo Data: {item.pirkimodata}</Text>
            <Text style={styles.info}>Svoris: {item.svoris}</Text>
          </View>
          <View style={styles.checkmark}>
            {item.skenuotas ? (
              <Image
                source={require("../assets/marker.png")}
                style={styles.imageStyle}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.retrieveData()}
            />
          }
        >
          <DatePicker
            style={{ width: 200, alignSelf: "center" }}
            date={this.state.date} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2016-01-01"
            maxDate="2021-12-31"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={date => {
              this.setState({ date: date });
            }}
          />
          <FlatList
            data={this.state.data}
            keyExtractor={item => item.docId}
            renderItem={this.renderItem}
            extraData={this.state}
            style={styles.flatlist}
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => this.props.navigation.navigate("Camera")}
          >
            <Image source={require("../assets/camera.png")} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const TabScreenas = createStackNavigator(
  {
    Tab: {
      screen: Screen
    },
    Camera: {
      screen: Camera
    }
  },
  {
    initialRouteName: "Tab",
    headerMode: "none"
  }
);
const TabScreen = createAppContainer(TabScreenas);
export default TabScreen;

const styles = StyleSheet.create({
  setBorderRadius: {
    flex: 1,
    padding: 5,
    paddingTop: 5,
    width: "98%",
    backgroundColor: "#FFA500",
    borderRadius: 10
  },
  paddingas: {
    padding: 5,
    paddingTop: 5
  },
  flatlistStyle: {
    flexDirection: "row"
  },
  info: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16
  },
  buttonStyle: {
    backgroundColor: "white",
    color: "white",
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    bottom: 5,
    right: 5,
    borderRadius: 500
  },
  buttonContainer: {
    position: "absolute",
    alignItems: "flex-end",
    justifyContent: "space-between",
    bottom: 10,
    right: 10
  },
  imageStyle: {
    alignSelf: "center"
  },
  checkmark: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center"
  },
  flatlistContainer: {
    paddingTop: 5,
    paddingLeft: 5
  },
  addButton: {
    backgroundColor: "#ff5722",
    borderColor: "#ff5722",
    borderWidth: 1,
    height: 100,
    width: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  TouchableOpacityStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    backgroundColor: "black"
  }
});
