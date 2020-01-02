import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableHighlight, Image, TouchableOpacity } from "react-native";

import { SearchBar, Card, Button, Icon } from "react-native-elements";
import config from "../config";

export default class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Home",
    headerRight: (
      <TouchableHighlight
        underlayColor="#ffffff00"
        onPress={() => {
          navigation.navigate({routeName: "AddItem", params: {onRefresh: navigation.state.params.onRefresh}});
        }}
      >
        <View style={{ marginRight: 20, paddingTop: 5 }}>
          <Icon name="ios-add-circle-outline" type="ionicon" size={30} color="#00BFFF" />
        </View>
      </TouchableHighlight>
    )
  });

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null      
    };

    this.arrayholder = [];    
  }
  
  componentDidMount() {    
    this.props.navigation.setParams({
      onRefresh: this.makeRemoteRequest
    });
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const url = `${config.api.host}/feed?latitude=23.279645&longitude=77.458415`;
    console.log("url", url);
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.items,
          error: res.error || null,
          loading: false
        });
        this.arrayholder = res.items;
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
          placeholder="Search books"
          placeholderTextColor="white"
          containerStyle={{ padding: 10 }}
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
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={({ item, index }) => (

            <TouchableOpacity key={index} onPress={() => {
              this.props.navigation.navigate("ItemDetail", item);
            }}>
              <Card pointerEvents="none">
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ marginRight: "auto" }}>
                  <Image style={styles.avatar} source={{ uri: `${item.picture}` }} />
                </View>
                <View style={{ justifyContent: "flex-end", width: '70%' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: "right", fontWeight: "bold" }}>{item.name}</Text>
                    <Text style={{ textAlign: "right" }}>by {item.author}</Text>
                    <Text style={{ textAlign: "right" }}>
                      {"\u20B9"} {item.price}
                    </Text>
                  </View>
                </View>
              </View>              
            </Card>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.name}          
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
  },
  avatar: {
    width: 60,
    height: 60
  }
});
