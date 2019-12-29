import React, { Component } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	Alert
} from "react-native";

import Logo from "../components/Logo";

export default class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	clickEventListener() {
		if (
			this.state.email != null &&
			this.state.email != "" &&
			this.state.name != null &&
			this.state.name != "" &&
			this.state.mobile != null &&
			this.state.mobile != "" &&
			this.state.password != null &&
			this.state.password != "" &&
			this.state.confirmation != null &&
			this.state.confirmation != ""
		) {
			if (this.state.password != this.state.confirmation) {
				Alert.alert("Alert", "Password and confirmation do not match.");
			} else {
				Alert.alert("Success", "Login with your email and password.");
				this.props.navigation.navigate("Login");
			}
		} else {
			Alert.alert("Alert", "All fields are mandatory.");
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
						placeholder="Name"
						placeholderTextColor="black"
						onChangeText={name => this.setState({ name })}
						value={this.state.name}
					/>
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
						placeholder="Mobile"
						keyboardType="number-pad"
						placeholderTextColor="black"
						onChangeText={mobile => this.setState({ mobile })}
						value={this.state.mobile}
					/>
					<TextInput
						style={styles.inputBox}
						placeholder="Password"
						placeholderTextColor="black"
						secureTextEntry={true}
						onChangeText={password => this.setState({ password })}
						value={this.state.password}
					/>
					<TextInput
						style={styles.inputBox}
						placeholder="Confirmation"
						placeholderTextColor="black"
						secureTextEntry={true}
						onChangeText={confirmation => this.setState({ confirmation })}
						value={this.state.confirmation}
					/>
					<TouchableOpacity
						style={styles.button}
						onPress={() => this.clickEventListener()}
					>
						<Text style={styles.buttonText}>Register</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.signupTextCont}>
					<Text style={styles.signupText}>Already have an account?</Text>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.navigate("Login");
						}}
					>
						<Text style={styles.signupButton}> Login</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column"
	},
	header: {
		backgroundColor: "#00BFFF",
		height: 150
	},
	form: {
		alignItems: "center",
		marginTop: 20
	},	
	inputBox: {
		borderRadius: 10,		
		fontSize: 16,
		marginVertical: 10,
		borderColor: "black",
		borderWidth: 1,
		width: '80%',
		padding: 6,
		paddingLeft: 10
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
		flexDirection: "row",
		marginBottom: 20
	},
	signupText: {
		fontSize: 14
	},
	signupButton: {
		fontSize: 14,
		fontWeight: "bold"
	}	
});
