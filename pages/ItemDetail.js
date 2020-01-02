import React, { Component } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	ScrollView,
} from "react-native";

export default class ItemDetail extends Component {
	constructor(props) {
		super(props);
	}

	static navigationOptions = {
		title: "Book Details"
	};

	clickEventListener() {
		this.props.navigation.navigate("PaymentWebView");
	}

	htmlEntities(html) {
		let str = html.replace(/<[^>]*>?/gm, '');
		if(!str){
		  return "No description available."
		}
		
		return str;
	  }
	  

	render() {
		const {
			id,
			name,
			description,
			picture,
			price
		} = this.props.navigation.state.params;
		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={{ alignItems: "center", marginHorizontal: 30 }}>
						<Image style={styles.productImg} source={{ uri: `${picture}` }} />
						<Text style={styles.name}>{name}</Text>
					</View>
					<View style={styles.separator}></View>
					<View style={{ flex: 1, marginHorizontal: 30 }}>
						<Text style={styles.description}>{this.htmlEntities(
							description)}</Text>
					</View>
					<View style={styles.separator}></View>
					<View style={styles.addToCarContainer}>
						<TouchableOpacity
							style={styles.shareButton}
							onPress={() => this.clickEventListener()}
						>
							<Text style={styles.shareButtonText}>Pay  {"\u20B9"} {`${price}`}</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20
	},
	productImg: {
		width: 200,
		height: 200
	},
	name: {
		fontSize: 20,
		color: "#696969",
		fontWeight: "bold",
		marginTop: 10
	},
	price: {
		marginTop: 10,
		fontSize: 18,
		color: "green",
		fontWeight: "bold"
	},
	description: {
		textAlign: "left",
		marginTop: 10,
		color: "#696969"
	},
	star: {
		width: 40,
		height: 40
	},
	btnColor: {
		height: 30,
		width: 30,
		borderRadius: 30,
		marginHorizontal: 3
	},
	btnSize: {
		height: 40,
		width: 40,
		borderRadius: 40,
		borderColor: "#778899",
		borderWidth: 1,
		marginHorizontal: 3,
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	starContainer: {
		justifyContent: "center",
		marginHorizontal: 30,
		flexDirection: "row",
		marginTop: 20
	},
	contentColors: {
		justifyContent: "center",
		marginHorizontal: 30,
		flexDirection: "row",
		marginTop: 20
	},
	contentSize: {
		justifyContent: "center",
		marginHorizontal: 30,
		flexDirection: "row",
		marginTop: 20
	},
	separator: {
		height: 2,
		backgroundColor: "#eeeeee",
		marginTop: 5,
		marginHorizontal: 30
	},
	shareButton: {
		marginTop: 10,
		height: 35,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		backgroundColor: "#00BFFF",
		marginBottom: 10
	},
	shareButtonText: {
		color: "#FFFFFF",
		fontSize: 16
	},
	addToCarContainer: {
		marginHorizontal: 30
	}
});
