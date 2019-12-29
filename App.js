import React, { Component } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { YellowBox } from "react-native";


import Routes from "./Routes";

export default class App extends Component {
	constructor(props){
		super(props);
		YellowBox.ignoreWarnings(["Warning: componentWillReceiveProps", "VirtualizedLists", "Warning: componentWillMount"]);
	}
	render() {
		return (
			<View style={styles.container}>
				<StatusBar backgroundColor="#1c313a" barStyle="light-content" />
				<Routes />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
