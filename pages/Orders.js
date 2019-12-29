import React, { Component } from "react";
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	StyleSheet
} from "react-native";

import { SearchBar, Card, Button } from "react-native-elements";

export default class Orders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			data: [],
			error: null
		};

		this.arrayholder = [];
	}

	static navigationOptions = {
		title: "Orders"		
	};

	componentDidMount() {
		this.makeRemoteRequest();
	}

	makeRemoteRequest = () => {
		const url = `https://ec04a1bd.ngrok.io/orders`;
		this.setState({ loading: true });

		fetch(url)
			.then(res => res.json())
			.then(res => {
				console.log("result: ", res);
				this.setState({
					data: res.orders,
					error: res.error || null,
					loading: false
				});
				this.arrayholder = res.orders;
			})
			.catch(error => {
				this.setState({ error, loading: false });
			});
	};

	renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: "86%",
					backgroundColor: "#CED0CE",
					marginLeft: "14%"
				}}
			/>
		);
	};

	searchFilterFunction = text => {
		this.setState({
			value: text
		});

		const newData = this.arrayholder.filter(item => {
			const itemData = `${item.name.toUpperCase()}`;
			const textData = text.toUpperCase();

			return itemData.indexOf(textData) > -1;
		});
		this.setState({
			data: newData
		});
	};

	renderHeader = () => {
		return (
			<View>
				<SearchBar
					placeholder="Search orders"
					placeholderTextColor="white"					
					round
					onChangeText={text => this.searchFilterFunction(text)}
					autoCorrect={false}
					value={this.state.value}
				/>
			</View>
		);
	};

	render() {
		if (this.state.loading) {
			return (
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
				>
					<ActivityIndicator />
				</View>
			);
		}

		const statusList = {
			PE: "Pending",
			BO: "Booked",
			DV: "Delivered",
			RN: "Returned",
		  };

		return (
			<View style={styles.container}>
				<FlatList
					data={this.state.data}
					renderItem={({ item }) => (						
						<Card title={`${item.name}`}>
							<Text style={{ marginBottom: 10 }}>Status - {statusList[item.status]}</Text>
							<Text style={{ marginBottom: 10 }}>Price - {item.price}</Text>
							<Button
								buttonStyle={{
									borderRadius: 0,
									marginLeft: 0,
									marginRight: 0,
									marginBottom: 0
								}}
								title="RETURN"
							/>
						</Card>
					)}
					keyExtractor={item => item.name}
					ItemSeparatorComponent={this.renderSeparator}
					ListHeaderComponent={this.renderHeader}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 20		
	}
});
