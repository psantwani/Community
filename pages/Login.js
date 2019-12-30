import React, { Component } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, AsyncStorage } from "react-native";

import Logo from "../components/Logo";
import config from "../config";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userId: ""
    };
  }

  async clickEventListener() {
    try {
      let response = await fetch(`${config.api.host}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      });

      if (response.ok) {
        let responseJson = await response.json();
        this.setState({ userId: responseJson.id });

        try {
          await AsyncStorage.setItem("is_logged_in", "true");
        } catch (error) {
          console.error("AsyncStorage error: " + error.message);
        }
        this.props.navigation.navigate("Home");
      } else {
        Alert.alert("Login Failed", "You entered wrong email and password");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login Failed", "Something went wrong");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Logo />
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.inputBox}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="black"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Password"
            placeholderTextColor="black"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <TouchableOpacity style={styles.button} onPress={() => this.clickEventListener()}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.props.navigation.navigate("Signup");
            }}
          >
            <Text style={styles.signupButton}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: "#00BFFF",
    height: 150
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100
  },
  inputBox: {
    borderRadius: 10,
    fontSize: 16,
    marginVertical: 10,
    borderColor: "black",
    borderWidth: 1,
    width: "80%",
    padding: 10
  },
  button: {
    backgroundColor: "#71a4d1",
    borderRadius: 10,
    marginVertical: 10,
    padding: 14,
    width: 150
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "white"
  },
  signupTextCont: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 16,
    flexDirection: "row",
    marginBottom: 10
  },
  signupText: {
    fontSize: 14
  },
  signupButton: {
    fontSize: 14,
    fontWeight: "bold"
  }
});
