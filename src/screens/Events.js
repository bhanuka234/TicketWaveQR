import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getToken from '../api/getToken';
import EventsApi from '../api/EventsApi';
import GradientBackground from '../components/GradientBackground';
import GradientButton from '../components/GradientButton'; // adjust path if necessary
import {BackHandler} from 'react-native';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true, // disable back action
    );

    getToken()
      .then(token => EventsApi(token))
      .then(data =>
        this.setState({data: data.status === 'SUCCESS' ? data.events : []}),
      )
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    if (this.backHandler) {this.backHandler.remove();}
  }

  async logout() {
    await AsyncStorage.setItem('@token', '');
    await AsyncStorage.setItem('@isLoggedIn', '0');
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <GradientBackground>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <View style={styles.container}>
          <View style={styles.backContent}>
            <Text style={styles.backText}>Events</Text>
          </View>

          <FlatList
            data={this.state.data}
            renderItem={({item, index}) => (
              <View style={styles.card}>
                <Text style={styles.indexText}>{index + 1}.</Text>
                <Text style={styles.titleText}>{item.post_title}</Text>
                <GradientButton
                  text="View"
                  onPress={() =>
                    this.props.navigation.navigate('ListTickets', {
                      eid: parseInt(item.ID),
                      title: item.post_title,
                    })
                  }
                  style={styles.viewButton}
                />
              </View>
            )}
            keyExtractor={item => item.post_title}
          />
        </View>
      </GradientBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    color: '#ff66cc',
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  backContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backText: {
    fontSize: 25,
    color: '#FF71D2',
    marginLeft: 30,
    marginTop: 30,
    marginBottom: 30,
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
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  viewText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Events;
