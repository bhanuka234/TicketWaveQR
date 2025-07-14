import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import GradientButton from '../components/GradientButton';
// import {PermissionsAndroid, Alert} from 'react-native';
import BottomNavBar from '../components/BottomNavBar';

class ListTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {eid: []};
  }

  componentDidMount() {
    this.setState({eid: parseInt(JSON.stringify(this.props.route.params.eid))});
  }

  handleBack = () => {
    this.props.navigation.goBack();
  };

  async logout() {
    await AsyncStorage.multiSet([
      ['@token', ''],
      ['@isLoggedIn', '0'],
    ]);
    this.props.navigation.navigate('Login');
  }

  render() {
    const {title} = this.props.route.params;

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
              <TouchableOpacity onPress={this.handleBack}>
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
            <Text style={styles.title}>{title}</Text>
            <View style={styles.spacer} />
            <GradientButton
              text={
                <View style={styles.scanContent}>
                  <Image
                    source={require('../assets/oHistory.png')}
                    style={styles.historyIcon}
                  />
                  <Text style={styles.scanText}>History</Text>
                </View>
              }
              style={styles.historyBtn}
              onPress={() =>
                this.props.navigation.navigate('History', {
                  eid: this.state.eid,
                })
              }
            />
            <GradientButton
              text={
                <View style={styles.scanContent}>
                  <Image
                    source={require('../assets/scannericon.png')}
                    style={styles.scanIcon}
                  />
                  <Text style={styles.scanText}>Scan</Text>
                </View>
              }
              onPress={() =>
                this.props.navigation.navigate('ScanBarcode', {
                  eid: this.state.eid,
                })
              }
              style={styles.scanBtn}
              textStyle={styles.btnTextWrap}
            />

            {/* <BottomNavBar hideScan={true} /> */}
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
  spacer: {
    flex: 1,
    justifyContent: 'center',
  },
  scanBtn: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: 'center',
    minWidth: 200,
    minHeight: 70,
    marginBottom: 150,
    marginTop: 30,
  },
  historyBtn:{
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: 'center',
    minWidth: 200,
    minHeight: 70,
    marginBottom: 20,
  },
  scanContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    tintColor: '#fff',
  },
  historyIcon:{
    width: 40,
    height: 40,
    marginRight: 10,
  },
  scanText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#fff',
  },
  btnTextWrap: {
    paddingHorizontal: 0,
  },
});

export default ListTickets;
