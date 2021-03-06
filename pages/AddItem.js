import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Picker, Alert, ActivityIndicator } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { ScrollView } from "react-native-gesture-handler";
import config from "../config";

export default class AddItem extends Component {
  constructor(props) {
    super(props);
    //Initialization of state
    //books will contain the array of suggestion
    //query will have the input from the autocomplete input
    this.state = {
      books: [],
      query: "",
      bookId: "",
      prevQuery: "",
      closeAutoSuggestion: true,
      locations: [],
      location: "Choose location",
      locationId: "",
      loading: true,
      locationsMap: {},
      error: {}
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onRefresh: this.getLocationsOfUser
    });
    this.getLocationsOfUser();
  }

  getLocationsOfUser = () => {
    const url = `${config.api.host}/user/locations`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        let map = {};
        for (let i = 0; i < res.locations.length; i++) {
          let title = res.locations[i].title;
          let id = res.locations[i].id;
          map[title] = id;
        }
        this.setState({
          locations: res.locations,
          loading: false,
          locationsMap: map
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ error, loading: false });
      });
  };

  insertItem = async () => {
    return new Promise(async (resolve, reject) => {
      this.setState({ loading: true });
      const { bookId, locationId } = this.state;
      const bookUuid = await this.insertBook(bookId);
      if (!bookUuid) {
        Alert.alert("Oops", "We failed to submit your contribution. Try again later.");
        this.setState({ loading: false });
        return reject("done");
      }

      console.log("inserting item");
      let response = await fetch(`${config.api.host}/item`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          book_id: bookUuid,
          location_id: locationId
        })
      });

      if (response.ok) {
        Alert.alert("Submitted", "Thank you for your contribution.");
        // this.setState({ loading: false });
        this.props.navigation.navigate("Home");
        return resolve("done");
      } else {
        Alert.alert("Oops", "We failed to submit your contribution. Try again later.");
        this.setState({ loading: false });
        return reject("done");
      }
    });
  };

  insertBook = async bookId => {
    return new Promise(async (resolve, reject) => {
      console.log("insertBook", `${config.api.host}/book/${bookId}`);
      let response = await fetch(`${config.api.host}/book/${bookId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        let responseJson = await response.json();
        return resolve(responseJson.id);
      } else {
        return resolve(null);
      }
    });
  };

  findBook(query) {
    if (this.state.closeAutoSuggestion) {
      return [];
    }
    //method called everytime when we change the value of the input
    if (query === "") {
      //if the query is null then return blank
      return [];
    }

    if (query != null && query.length < 4) {
      //if the query is null then return blank
      return [];
    }

    if (query == this.state.prevQuery) {
      return this.state.books;
    }

    let URL = `${config.api.host}/books/search?query=${query}`;

    fetch(URL)
      .then(response => response.json())
      .then(responseJson => {
        console.log("Fetched results");
        let { books } = responseJson;
        books = books || [];
        this.setState({ books });
        this.setState({ prevQuery: query });
        //making a case insensitive regular expression to get similar value from the book json
        const regex = new RegExp(`${query.trim()}`, "i");
        //return the filtered book array according the query from the input
        return books.filter(book => book.name.search(regex) >= 0);
      })
      .catch(error => {
        console.error("error", error);
        return [];
      });
  }

  static navigationOptions = {
    title: "Add Book",
    headerStyle: { height: 80, paddingTop: 20 }
  };

  renderLocationPicker() {
    const locations = this.state.locations || [];
    return locations.map(location => {
      return <Picker.Item key={location.id} label={location.title} value={location.title} />;
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      );
    }

    const { query } = this.state;
    const books = this.findBook(query) || [];
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logoText}>
            Contribute to the community{"\n"}
            with your personal collection
          </Text>
        </View>
        <ScrollView style={styles.form}>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.autoCompleteContainer}
            inputContainerStyle={styles.autoCompleteInputBox}
            listContainerStyle={styles.autoCompleteListContainer}
            listStyle={styles.autoCompleteListItem}
            placeholderTextColor="black"
            data={books.length === 1 && comp(query, books[0].name) ? [] : books}
            value={query}
            onChangeText={text => {
              this.setState({ closeAutoSuggestion: false });
              this.setState({ query: text });
            }}
            placeholder="Enter book title"
            renderItem={({ item, i }) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  this.setState({ closeAutoSuggestion: true });
                  this.setState({ bookId: item.id });
                  this.setState({ query: item.name });
                  this.setState({ books: [] });
                }}
              >
                <View style={styles.suggestedItem}>
                  <Image style={styles.avatar} source={{ uri: `${item.thumbnail}` }} />
                  <Text style={styles.itemText}>
                    {item.name} by {item.author}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TextInput
            style={styles.timeBox}
            placeholder="Pick up time"
            placeholderTextColor="black"
            onChangeText={time => this.setState({ time })}
            value={this.state.time}
          />
          <Picker
            mode="dialog"
            style={styles.picker}
            selectedValue={this.state.location}
            itemStyle={styles.pickerItem}
            onValueChange={location => {
              if (location == "Add location") {
				this.props.navigation.navigate({routeName: "AddLocation", params: {onRefresh: this.props.navigation.state.params.onRefresh}});
              } else {
                this.setState({ location, locationId: this.state.locationsMap[location] });
              }
            }}
          >
            <Picker.Item style={{ padding: 30, height: 60 }} label="Choose location" value="Choose location" />
            {this.renderLocationPicker()}
            <Picker.Item label="Add location" value="Add location" />
          </Picker>
          <TouchableOpacity style={styles.button} onPress={() => this.clickEventListener()}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  clickEventListener = async () => {
    try {
      await this.insertItem();
      this.props.navigation.goBack();
      this.props.navigation.state.params.onRefresh();
    } catch (error) {
      console.log(error);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    marginTop: 20,
    flexDirection: "column"
  },
  autoCompleteContainer: {
    alignSelf: "center",
    width: "80%",
    zIndex: 9999,
    marginVertical: 10
  },
  autoCompleteInputBox: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 0,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  autoCompleteListContainer: {
    zIndex: 9999
  },
  suggestedItem: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#d6d7da"
  },
  itemText: {
    fontSize: 12,
    marginLeft: 10,
    width: 150
  },
  avatar: {
    width: 50,
    height: 50
  },
  timeBox: {
    padding: 10,
    width: "80%",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10
  },
  picker: {
    width: "80%",
    alignSelf: "center",
    height: 50,
    borderColor: "black",
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1
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
    color: "white"
  }
});
