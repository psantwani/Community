import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Alert
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export default class AddLocation extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			location: {},
			address: "",
			landmark: ""
		};
	}

	static navigationOptions = {
		title: "Add Location",
		headerStyle: { height: 80, paddingTop: 20 }
	};

	

	render() {		
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.logoText}>
						Add a new location to{"\n"}your community profile
					</Text>
				</View>
				{this.renderGoogleAutoComplete()}
				<View style={styles.form}>
				<TextInput
						style={styles.inputBox}
						placeholder="Flat/Floor/Building"
						value={this.state.address}
						placeholderTextColor="black"
						onChangeText={address => this.setState({ address })}
						multiline={true}
					/>
					<TextInput
						style={styles.inputBox}
						placeholder="Landmark"
						placeholderTextColor="black"
						value={this.state.landmark}
						onChangeText={landmark => this.setState({ landmark })}
						multiline={true}
					/>				
				<TouchableOpacity
					style={styles.button}
					onPress={() => this.clickEventListener()}
				>
					<Text style={styles.buttonText}>Submit</Text>
				</TouchableOpacity>
				</View>
			</View>
		);
	}

	clickEventListener = () => {
		Alert.alert("state", JSON.stringify(this.state));
		this.props.navigation.goBack();
	}
	
	renderGoogleAutoComplete(){
		return (
			<GooglePlacesAutocomplete
          placeholder="Search location"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="auto" // true/false/undefined
		  fetchDetails={true}
		  placeholderTextColor="black"
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
			this.setState({location: {
				id: details.id,
				place_id: details.place_id,
				name: details.name,				
				latitude: details.geometry.location.lat,
				longitude: details.geometry.location.lng,
				formatted_address: details.formatted_address
			}});
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyAmedqvwxJxCRqhtNZCmAkzEqjhlcjQuOM',
            language: 'en', // language of the results            
          }}
          styles={{
			container:{				
				marginVertical: 10,
				zIndex: 9999,				
				marginTop: 40,
				width: '80%',
				alignSelf: "center"	
			},
			listView:{
				zIndex: 9999,				
				color: "white",
				backgroundColor: "#F0FFFF"
			},
			row:{
				color: "white"
			},
            textInputContainer: {
				zIndex: 100,
				borderColor: "black",
				backgroundColor: "white",
				borderWidth: 1,                 
				marginVertical: 10,
				borderRadius: 10,                   
				fontSize: 14				
			},                                  
			description: {
				fontWeight: "bold"
			},
			predefinedPlacesDescription: {
				color: "#1faadb"
			}
          }}
          currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={
            {
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }
          }
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'food',
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          predefinedPlaces={[]}
          debounce={200}
        />
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
		height: 80
	},
	logoText: {
		marginVertical: 15,
		fontSize: 18,
		color: "white",
		paddingLeft: 10,
		paddingRight: 10,
		alignSelf: "center",
		textAlign: "center"
	},
	form: {
		flex: 1,
		marginTop: 190,
		flexDirection: "column",		
		position: "absolute",
		width: "100%"	
	},
	inputBox: {
		borderColor: "black",
		backgroundColor: "white",
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		fontSize: 14,
		marginVertical: 10,		
		zIndex: 1,
		width: "80%",
		alignSelf: "center"		
	},
	button: {
		borderWidth: 1,
		borderRadius: 10,
		backgroundColor: "#71a4d1",
		padding: 16,
		marginBottom: 30,
		width: "60%",
		alignSelf: "center",
		marginVertical: 10
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
		color: "#ffffff"
	}	
});
