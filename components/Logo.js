import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class Logo extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.logoText}>Welcome to Community</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	logoText: {
		marginTop: 25,
		fontSize: 24,
		fontWeight: "bold",
		color: "white"
	}
});
