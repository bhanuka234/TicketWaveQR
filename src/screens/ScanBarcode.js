import React, {Component} from 'react';
import {StyleSheet, View, Text, Alert, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity, StatusBar, Image} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import BottomNavBar from '../components/BottomNavBar';

class ScanBarcode extends Component {
  static navigationOptions = {
    title: 'Scan BarCode',
  };

  handleBack = () => {
    this.props.navigation.goBack();
  };

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
    };
  }

  render() {
    let validJXS = <View />;

    if (this.state.valid_ticket === 'SUCCESS') {
      validJXS = (
        <View style={styles.success}>
          <Text style={styles.valid_text}>V</Text>
        </View>
      );
    } else if (this.state.valid_ticket === 'FAIL') {
      validJXS = (
        <View style={styles.fail}>
          <Text style={styles.valid_text}>X</Text>
        </View>
      );
    }

    const seatJXS = this.state.seat ? (
      <Text style={styles.label}>
        Seat: <Text style={styles.value}> {this.state.seat}</Text>
      </Text>
    ) : (
      <View />
    );

    const customerJXS = this.state.name_customer ? (
      <Text style={styles.label}>
        Guest: <Text style={styles.value}> {this.state.name_customer}</Text>
      </Text>
    ) : (
      <View />
    );

    const checkinJXS = this.state.checkin_time ? (
      <Text style={styles.label}>
        Check-in: <Text style={styles.value}> {this.state.checkin_time}</Text>
      </Text>
    ) : (
      <View />
    );

    const ecalJXS = this.state.e_cal ? (
      <Text style={styles.label}>
        Date-Time: <Text style={styles.value}> {this.state.e_cal}</Text>
      </Text>
    ) : (
      <View />
    );

    return (
      <>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.handleBack} style={styles.backBtn}>
              <View style={styles.backContent}>
                <Image
                  source={require('../assets/back.png')}
                  style={styles.backIcon}
                  resizeMode="contain"
                />
                <Text style={styles.backText}>Back</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Camera
            ref={ref => (this.camera = ref)}
            cameraType={CameraType.Back} // front/back(default)
            flashMode="auto"
            // Barcode props
            scanBarcode={true}
            onReadCode={event => this.onBarCodeRead(event)}
            showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner, that stops when a code has been found. Frame always at center of the screen
            laserColor="red" // (default red) optional, color of laser in scanner frame
            frameColor="white"
            style={styles.preview}
          />

          <View style={styles.result}>
            <View style={styles.result_left}>{validJXS}</View>

            <View style={styles.result_right}>
              {customerJXS}

              {seatJXS}

              {ecalJXS}

              {checkinJXS}
            </View>
          </View>
          <BottomNavBar />
        </SafeAreaView>
      </>
    );
  }

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

    if (event.data === this.state.token_storate) {}
    else if (event.data !== 'null') {
      // Validate Ticket
      fetch(url + 'wp-json/meup/v1/validate_ticket/', {
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
        .then(res => res.json())
        .then(resjson => {
          if (resjson.status === 'FAIL') {
            Alert.alert('FAIL', resjson.msg, [
              {
                text: 'Continue',
                onPress: () => this.reset(),
              },
            ]);
          } else if (resjson.status === 'SUCCESS') {
            Alert.alert('SUCCESS', resjson.msg, [
              {
                text: 'Continue',
                onPress: () => this.reset(),
              },
            ]);
          }

          this.setState({
            valid_ticket: resjson.status,
            name_customer: resjson.name_customer,
            seat: resjson.seat,
            checkin_time: resjson.checkin_time,
            e_cal: resjson.e_cal,
          });
        })
        .catch(error => {
          Alert('error, please scan again');
        });

      this.setState({token_storate: event.data});
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
    backgroundColor: 'transparent',
    zIndex: 10, // Bring it above the camera
    position: 'absolute', // Optional, to overlay on top
    top: StatusBar.currentHeight || 0,
    left: 0,
    right: 0,
    padding: 10,
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
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
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fail: {
    backgroundColor: 'red',
    flex: 1,
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