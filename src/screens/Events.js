import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getToken from '../api/getToken';
import EventsApi from '../api/EventsApi';
import GradientBackground from '../components/GradientBackground';
import GradientButton from '../components/GradientButton';
import BottomNavBar from '../components/BottomNavBar';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      
    };
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
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  

  

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
              <View style={styles.backContent}>
                <Text style={styles.backText}>Events</Text>
              </View>

              
            </View>

            <View style={styles.container}>
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

              <GradientButton
                text="history"
                onPress={() => this.props.navigation.navigate('History')}
                style={{width: 150, height: 50, marginTop: 20}}
                textStyle={{fontSize: 16}}
              />
            </View>
            <BottomNavBar/>
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
    justifyContent: 'space-between',
    marginLeft: -50,
    marginRight: -20,
    paddingRight: 20,
  },
  backContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 25,
    color: '#FF71D2',
    marginLeft: 50,
    marginTop: 30,
    fontWeight: '500',
  },
  logoutBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 20,
    color: '#FF71D2',
    fontWeight: '600',
    marginTop: 30,
  },
  container: {
    flex: 1,
    marginTop: 20,
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
});

export default Events;