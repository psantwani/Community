import React, { Component } from "react";
import WebView from "react-native-webview";

export default class PaymentWebView extends Component {
	constructor(props) {
		super(props);
	}

	static navigationOptions = {
		title: "Payments",
		headerStyle: { height: 80, paddingTop: 20 }
	};

	render() {
		return <WebView source={{ uri: "https://p-y.tm/t4-kFEL" }} />;
	}
}
