import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import config from "./config";

export default class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "Login",
      loading: true
    };
  }

  async componentDidMount() {
	// await this.logout(); 	
    AsyncStorage.getItem("is_logged_in").then(async isLoggedIn => {      
      let screen;
      if (isLoggedIn === "true") {
        screen = "Home";
      } else {
        screen = "Login";
      }
      this.setState({ screen });
      this.setState({ loading: false });
    });
  }

  async logout() {
    return new Promise((resolve, reject) => {      
      fetch(`${config.api.host}/logout`)
        .then(() => {
			return AsyncStorage.setItem("is_logged_in", "false");
		})
		.then(() => {			
			this.setState({ isLoggedIn: "false" })
			return resolve(true);
		})
        .catch(error => {
          console.log("error", error);
        });
    });
  }

  render() {
    if (this.state.loading) {
      return null;
    } else {
      if (this.state.screen == "Login") {
        return <LoginAppContainer />;
      } else {
        return <HomeAppContainer />;
      }
    }
  }
}

const commonStack = {
  Login: { screen: Login },
  Signup: { screen: Signup },
  Home: { screen: Home }
};

const commonStackOption = {
  headerMode: "none",
  navigationOptions: {
    headerVisible: false
  }
};

const AppStackWithLogin = createStackNavigator(commonStack, {
  initialRouteName: "Login",
  ...commonStackOption
});

const AppStackWithHome = createStackNavigator(commonStack, {
  initialRouteName: "Home",
  ...commonStackOption
});

const LoginAppContainer = createAppContainer(AppStackWithLogin);
const HomeAppContainer = createAppContainer(AppStackWithHome);
