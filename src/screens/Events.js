import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getToken from '../api/getToken';
import EventsApi from '../api/EventsApi';
import GradientBackground from '../components/GradientBackground';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    getToken()
      .then(token => EventsApi(token))
      .then(data =>
        this.setState({ data: data.status === 'SUCCESS' ? data.events : [] })
      )
      .catch(err => console.log(err));
  }

  async logout() {
    await AsyncStorage.setItem('@token', '');
    await AsyncStorage.setItem('@isLoggedIn', '0');
    this.props.navigation.navigate('Login');
  }

  // Add a function to handle going back
  handleBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <GradientBackground>
          <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={this.handleBack}
                style={styles.backBtn}>
                <View style={styles.backContent}>
                  <Image
                    source={require('../assets/back.png')}
                    style={styles.backIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.backText}>Events</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <FlatList
                data={this.state.data}
                renderItem={({ item, index }) => (
                  <View style={styles.card}>
                    <Text style={styles.indexText}>{index + 1}.)</Text>
                    <Text style={styles.titleText}>{item.post_title}</Text>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() =>
                        this.props.navigation.navigate('ListTickets', {
                          eid: parseInt(item.ID),
                          title: item.post_title,
                        })
                      }
                    >
                      <Text style={styles.viewText}>View</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={item => item.post_title}
              />
            </View>
          </SafeAreaView>
        </GradientBackground>
      </>
    );
  }
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -50,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  backContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backText: {
    fontSize: 25,
    color: '#FF71D2',
    marginLeft: -30,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  titleText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  viewButton: {
    backgroundColor: '#3c70ff',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  viewText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Events;
