import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

export default class Routes extends Component {
	
	constructor(props){
		super(props);
	}
	
	render() {
		return <AppContainer />;
	}
}

const Route = () => {
	const loggedIn = true;
	if (loggedIn) {
		return "Home";
	} else {
		return "Login";
	}
};

const AppStack = createStackNavigator(
	{
		Login: { screen: Login },
		Signup: { screen: Signup },
		Home: { screen: Home }
	},
	{
		initialRouteName: Route(),
		headerMode: "none",
		navigationOptions: {
			headerVisible: false
		}
	}
);

const AppContainer = createAppContainer(AppStack);
