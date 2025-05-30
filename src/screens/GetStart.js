import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import GradientBackground from "../components/GradientBackground";

class GetStart extends Component {
  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Image
            source={require("../assets/scannericon.png")}
            style={styles.logo}
          />
          <Text style={{ textAlign: "center", marginTop: 50, color: "#fff" }}>
            Explore powerful tools for hassle-free event ticket scanning - totally free!
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.props.navigation.navigate("Events")}
          >
              <Text style={styles.btn_text}>Let's Start  ➔</Text>
              

          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  btn: {
    height: 40,
    width: 120,
    backgroundColor: "#e86c60",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  btn_text: {
    color: "#fff",
    fontSize: 16,
    borderRadius: 5,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 150,
    marginBottom: 30,
    alignSelf: "center",
  },
});

export default GetStart;
