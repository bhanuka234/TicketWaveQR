import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Platform,
  Vibration,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, CameraType } from 'react-native-camera-kit';
import Icon from 'react-native-vector-icons/Entypo';
import Sound from 'react-native-sound';
import BottomNavBar from '../components/BottomNavBar';

class ScanBarcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraReady: false,
      url: '',
      token: '',
      eid: '',
      valid_ticket: '',
      token_storate: 'true',
      name_customer: '',
      seat: '',
      checkin_time: '',
      e_cal: '',
      flashlightOn: false,
    };
  }

  componentDidMount() {
    try {
      console.log("beep sound on");
      Sound.setCategory('Playback');
      this.beepSound = new Sound(require('../assets/beep.mp3'), (error) => {
        if (error) {
          console.log('❌ Failed to load beep sound:', error);
        } else {
          console.log('✅ Beep sound loaded');
        }
      });
    } catch (e) {
      console.log('❗ Error initializing sound:', e);
    }
  }

  toggleFlashlight = () => {
    this.setState({ flashlightOn: !this.state.flashlightOn });
  };

  goToSettings = () => {
    this.props.navigation.navigate('Setting');
  };

  reset() {
    this.setState({
      token_storate: '',
      valid_ticket: '',
      name_customer: '',
      seat: '',
      checkin_time: '',
      e_cal: '',
    });
  }

  async onBarCodeRead(event) {
    const token = await AsyncStorage.getItem('@token');
    const url = await AsyncStorage.getItem('@url');
    const eid = JSON.stringify(this.props.route.params.eid);
    const vibrate = JSON.parse(await AsyncStorage.getItem('@vibrate'));
    const beep = JSON.parse(await AsyncStorage.getItem('@beep'));

    if (event.data === this.state.token_storate) return;

    fetch(`${url}wp-json/meup/v1/validate_ticket/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        qrcode: event.data,
        eid: eid,
      }),
    })
      .then((res) => res.json())
      .then((resjson) => {
        if (resjson.status === 'SUCCESS') {
          if (beep && this.beepSound?.isLoaded()) {
            this.beepSound.stop(() => {
              this.beepSound.play();
            });
          }

          if (vibrate) {
            Vibration.vibrate(500);
          }

          Alert.alert('SUCCESS', resjson.msg, [
            { text: 'Continue', onPress: () => this.reset() },
          ]);
        } else if (resjson.status === 'FAIL') {
          Alert.alert('FAIL', resjson.msg, [
            { text: 'Continue', onPress: () => this.reset() },
          ]);
        }

        this.setState({
          valid_ticket: resjson.status,
          name_customer: resjson.name_customer,
          seat: resjson.seat,
          checkin_time: resjson.checkin_time,
          e_cal: resjson.e_cal,
          token_storate: event.data,
        });
      })
      .catch((error) => {
        alert('Error, please scan again');
      });
  }

  render() {
    const {
      valid_ticket,
      name_customer,
      seat,
      checkin_time,
      e_cal,
    } = this.state;

    const validJXS =
      valid_ticket === 'SUCCESS' ? (
        <View style={styles.success}><Text style={styles.valid_text}>V</Text></View>
      ) : valid_ticket === 'FAIL' ? (
        <View style={styles.fail}><Text style={styles.valid_text}>X</Text></View>
      ) : <View />;

    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={this.toggleFlashlight}>
            <Icon name={this.state.flashlightOn ? 'flash' : 'light-bulb'} size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goToSettings}>
            <Icon name="cog" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Camera */}
        <Camera
          ref={(ref) => (this.camera = ref)}
          cameraType={CameraType.Back}
          flashMode={this.state.flashlightOn ? 'on' : 'off'}
          scanBarcode={true}
          onReadCode={(event) => this.onBarCodeRead(event)}
          showFrame={true}
          laserColor="red"
          frameColor="green"
          style={styles.preview}
        />

        {/* Results */}
        <View style={styles.result}>
          <View style={styles.result_left}>{validJXS}</View>
          <View style={styles.result_right}>
            {name_customer && (
              <Text style={styles.label}>
                Guest: <Text style={styles.value}>{name_customer}</Text>
              </Text>
            )}
            {seat && (
              <Text style={styles.label}>
                Seat: <Text style={styles.value}>{seat}</Text>
              </Text>
            )}
            {e_cal && (
              <Text style={styles.label}>
                Date-Time: <Text style={styles.value}>{e_cal}</Text>
              </Text>
            )}
            {checkin_time && (
              <Text style={styles.label}>
                Check-in: <Text style={styles.value}>{checkin_time}</Text>
              </Text>
            )}
          </View>
          
        </View>
        <View style={styles.bottomBarWrapper}>
          <BottomNavBar />
        </View>

        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBarWrapper: {
  position: 'absolute',
  left: 20,
  right: 20,
  bottom: 40, // gap from the bottom of the screen
},
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 85,
    paddingRight: 85,
    backgroundColor: '#2c2c2c',
    position: 'absolute',
    borderRadius: 15,
    elevation: 25,
    top: Platform.OS === 'ios' ? 40 : 80,
    left: 55,
    right: 55,
    zIndex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  result: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  result_left: {
    flex: 1,
    backgroundColor: '#000',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  result_right: {
    flex: 4,
    backgroundColor: '#000',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 5,
  },
  success: {
    backgroundColor: '#90ba3e',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fail: {
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valid_text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    color: '#ccc',
  },
  value: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ScanBarcode;