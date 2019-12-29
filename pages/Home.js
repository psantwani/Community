import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Icon } from "react-native-elements";

import Feed from "./Feed";
import ItemDetail from "./ItemDetail";
import AddItem from "./AddItem";
import Orders from "./Orders";
import Profile from "./Profile";
import AddLocation from "./AddLocation";
import PaymentWebView from "./PaymentWebView";

export default class App extends React.Component {
	render() {
		return <AppContainer />;
	}
}

const HomeStack = createStackNavigator(
	{
		Feed: { screen: Feed },
		ItemDetail: { screen: ItemDetail },
		AddItem: { screen: AddItem },
		AddLocation: { screen: AddLocation },
		PaymentWebView: { screen: PaymentWebView }
	},
	{
		initialRouteName: "Feed",
		headerLayoutPreset: "center",
		defaultNavigationOptions: {
			headerStyle: {
				height: 80,
				paddingTop: 20
			},
			headerForceInset: { top: "never", bottom: "never" }
		}
	}
);

const OrderStack = createStackNavigator(
	{
		Orders: { screen: Orders }
	},
	{
		headerLayoutPreset: "center",
		defaultNavigationOptions: {
			headerStyle: {
				height: 80,
				paddingTop: 20
			},
			headerForceInset: { top: "never", bottom: "never" }
		}
	}
);

const TabNavigator = createBottomTabNavigator(
	{
		Feed: {
			screen: HomeStack,
			navigationOptions: {
				tabBarLabel: "Feed",
				tabBarIcon: () => <Icon name="home" size={20} />
			}
		},
		Orders: {
			screen: OrderStack,
			navigationOptions: {
				tabBarLabel: "Orders",
				tabBarIcon: () => <Icon name="receipt" size={20} />
			}
		},		
		Profile: {
			screen: Profile,
			navigationOptions: {
				tabBarLabel: "Profile",
				tabBarIcon: () => (
					<Icon color="black" name="user" type="font-awesome" size={20} />
				)
			}
		}
	},
	{
		tabBarOptions: { showLabel: false, activeTintColor: "#00BFFF" }
	}
);

const AppContainer = createAppContainer(TabNavigator);
