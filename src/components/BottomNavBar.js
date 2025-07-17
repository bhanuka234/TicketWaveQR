import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name;
  const isActive = screen => currentRoute === screen;

  const handleHistoryPress = async () => {
    const eid = await AsyncStorage.getItem('@selectedEid');
    if (eid) {
      navigation.navigate('History', {eid: parseInt(eid)});
    } else {
      alert('Please select an event first.');
    }
  };

  return (
    <View style={styles.bottomNavbarContainer}>
      {/* History */}
      <View style={styles.bottomNavHistory}>
        <TouchableOpacity onPress={handleHistoryPress}>
          <Image
            source={require('../assets/history.png')}
            style={[
              styles.historyButton,
              {tintColor: isActive('History') ? '#FF71D2' : 'white'},
            ]}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.navText,
              {color: isActive('History') ? '#FF71D2' : 'white'},
            ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scan icon */}
      {/* <DropShadow style={styles.shadowProp}> */}
        <View style={styles.bottomNavbarScanner}>
          <TouchableOpacity
            style={styles.scanButtonContainer}
            onPress={() => navigation.navigate('ScanBarcode')}>
            <Image
              source={require('../assets/scanNav.png')}
              style={styles.scanButton}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      {/* </DropShadow> */}

      {/* Events */}
      <View style={styles.bottomNavbarEvents}>
        <TouchableOpacity onPress={() => navigation.navigate('Events')}>
          <Image
            source={require('../assets/event.png')}
            style={[
              styles.eventButton,
              {tintColor: isActive('Events') ? '#FF71D2' : 'white'},
            ]}
          />
          <Text
            style={[
              styles.navText,
              {color: isActive('Events') ? '#FF71D2' : 'white'},
            ]}>
            Events
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavbarContainer: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNavHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  bottomNavbarScanner: {
    marginTop: -30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FD23EE',
    borderRadius: 50,
    padding: 15,
  },
  // shadowProp: {
  //   shadowColor: '#FD23EE',
  //   shadowOffset: {width: 0, height: 0},
  //   shadowOpacity: 1,
  //   shadowRadius: 20,
  //   elevation: 30,
  //   alignSelf: 'center',
  //   marginTop: -30,
  // },
  bottomNavbarEvents: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  historyButton: {
    width: 30,
    height: 30,
  },
  scanButton: {
    width: 40,
    height: 40,
  },
  eventButton: {
    width: 25,
    height: 25,
  },
  navText: {
    color: 'white',
    fontSize: 10,
    marginTop: 5,
  },
  scanButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomNavBar;