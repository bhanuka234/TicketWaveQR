import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getToken from '../api/getToken';
import EventsApi from '../api/EventsApi';
import GradientBackground from '../components/GradientBackground';
import GradientButton from '../components/GradientButton';
import CustomAlert from '../components/CustomAlert';
import BottomNavBar from '../components/BottomNavBar';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      showLogoutAlert: false,
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
        this.setState({
          data: data.status === 'SUCCESS' ? data.events : [],
          loading: false,
        }),
      )
      .catch(err => {
        console.log(err);
        this.setState({loading: false});
      });
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  confirmLogout = () => {
    this.setState({showLogoutAlert: true});
  };

  hideLogoutAlert = () => {
    this.setState({showLogoutAlert: false});
  };

  logout = async () => {
    try {
      await AsyncStorage.multiSet([
        ['@token', ''],
        ['@isLoggedIn', '0'],
      ]);
      this.setState({showLogoutAlert: false});
      this.props.navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

              {/* Logout Button */}
              <TouchableOpacity
                onPress={this.confirmLogout}
                style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.container}>
              {this.state.loading ? (
                <ActivityIndicator
                  size="70"
                  color="#ffffff"
                  style={styles.spinner}
                />
              ) : (
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
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No events found</Text>
                    </View>
                  }
                />
              )}

              {!this.state.loading && (
                <GradientButton
                  text="history"
                  onPress={() => this.props.navigation.navigate('History')}
                  style={{width: 150, height: 50, marginTop: 20}}
                  textStyle={{fontSize: 16}}
                />
              )}
            </View>
            <BottomNavBar hideScan={true} />
          </SafeAreaView>

          <CustomAlert
            visible={this.state.showLogoutAlert}
            title="Logout"
            message="Are you sure you want to logout?"
            onClose={this.hideLogoutAlert}
            onConfirm={this.logout}
            showCancel={true}
            confirmText="Logout"
            cancelText="Cancel"
          />
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
  spinner: {
    marginTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  emptyText: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
  },
});

export default Events;
