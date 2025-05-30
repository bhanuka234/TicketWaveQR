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

class ListTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {eid: null};
  }

  componentDidMount() {
    const {eid} = this.props.route.params;
    this.setState({eid: parseInt(eid)});
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
            {/* Custom Header */}
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
            <Text style={styles.title}>{title}</Text>
            <View style={styles.spacer} />

            {/* Scan Button */}
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
  // marginTop: 60,
  marginLeft: -50, // Shift the whole header slightly to the left
},
  backBtn: {
    // padding: 5,
  },
  title: {
    fontSize: 20,
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
    marginBottom: 100,
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
