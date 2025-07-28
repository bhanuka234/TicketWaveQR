import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  
  Platform,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, CameraType } from 'react-native-camera-kit';
import BottomNavBar from '../components/BottomNavBar';


class ScanBarcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      scanning: false,
      token_storate: '',
      valid_ticket: '',
      name_customer: '',
      seat: '',
      checkin_time: '',
      e_cal: '',
      token: '',
      url: '',
      eid: '',
      
      cameraPermissionGranted: false,
    };
  }

  async componentDidMount() {
  console.log('🚀 Component mounted');
  await this.loadSettings();

  // Persist eid to storage
  const eidFromParams = this.props.route?.params?.eid;
  if (eidFromParams) {
    await AsyncStorage.setItem('@selectedEid', eidFromParams.toString());
    this.setState({ eid: eidFromParams }); // Update state too
  }

  
  this.checkCameraPermission();
}



  async loadSettings() {
    const token = await AsyncStorage.getItem('@token');
    const url = await AsyncStorage.getItem('@url');
    
    const eid = JSON.stringify(this.props.route.params.eid);
    this.setState({ token, url, eid });
  }

  

  async checkCameraPermission() {
    if (Platform.OS === 'android') {
      // Request CAMERA permission first
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      const isCameraGranted = cameraGranted === PermissionsAndroid.RESULTS.GRANTED;
      console.log('📷 Camera permission granted:', isCameraGranted);
      this.setState({ cameraPermissionGranted: isCameraGranted });

      
    } else {
      console.log('📷 iOS assumed camera permission granted');
      this.setState({ cameraPermissionGranted: true});
    }
  }



  resetScan = () => {
    this.setState({
      token_storate: '',
      valid_ticket: '',
      name_customer: '',
      seat: '',
      checkin_time: '',
      e_cal: '',
      scanning: false,
    });
  };

 onBarCodeRead = async (event) => {
  const scannedCode = event.nativeEvent?.codeStringValue;

  console.log('📸 QR scanned:', scannedCode);
  const { scanning, token_storate, token, url, eid} = this.state;

  if (scanning || scannedCode === token_storate) {
    console.log('⏹ Skipping duplicate or ongoing scan');
    return;
  }

  this.setState({ scanning: true });
  console.log('🔄 Sending request to:', `${url}wp-json/meup/v1/validate_ticket/`);

  try {
    const response = await fetch(`${url}wp-json/meup/v1/validate_ticket/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        qrcode: scannedCode,
        eid,
      }),
    });

    const resjson = await response.json();
    console.log('✅ Response received:', resjson);

    

    if (resjson.status === 'SUCCESS') {
      Alert.alert('SUCCESS', `${resjson.msg}\n${resjson.name_customer}\n${resjson.ticket_type}`, [
        { text: 'Continue', onPress: () => this.resetScan() },
      ]);
    } else {
      Alert.alert('FAIL', resjson.msg, [
        { text: 'Continue', onPress: () => this.resetScan() },
      ]);
    }

    this.setState({
      valid_ticket: resjson.status,
      name_customer: resjson.name_customer,
      seat: resjson.seat,
      checkin_time: resjson.checkin_time,
      e_cal: resjson.e_cal,
      token_storate: scannedCode,
      ticket_type:resjson.ticket_type
    });
  } catch (error) {
    console.log('❌ Scan request failed:', error);
    Alert.alert('Error', 'Scan failed. Please try again.');
    this.setState({ scanning: false });
  }
};




  // renderResultBox = () => {
  //   const { valid_ticket, name_customer, seat, checkin_time, e_cal } = this.state;

  //   const statusBox =
  //     valid_ticket === 'SUCCESS' ? (
  //       <View style={styles.success}><Text style={styles.valid_text}>V</Text></View>
  //     ) : valid_ticket === 'FAIL' ? (
  //       <View style={styles.fail}><Text style={styles.valid_text}>X</Text></View>
  //     ) : <View />;

  //   return (
  //     <View style={styles.result}>
  //       <View style={styles.result_left}>{statusBox}</View>
  //       <View style={styles.result_right}>
  //         {name_customer && (
  //           <Text style={styles.label}>
  //             Guest: <Text style={styles.value}>{name_customer}</Text>
  //           </Text>
  //         )}
  //         {seat && (
  //           <Text style={styles.label}>
  //             Seat: <Text style={styles.value}>{seat}</Text>
  //           </Text>
  //         )}
  //         {e_cal && (
  //           <Text style={styles.label}>
  //             Date-Time: <Text style={styles.value}>{e_cal}</Text>
  //           </Text>
  //         )}
  //         {checkin_time && (
  //           <Text style={styles.label}>
  //             Check-in: <Text style={styles.value}>{checkin_time}</Text>
  //           </Text>
  //         )}
  //       </View>
  //     </View>
  //   );
  // };

  render() {
    if (!this.state.cameraPermissionGranted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center', marginTop: 100 }}>
            Camera permission not granted.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        
        
        


        {/* Camera View */}
        <Camera
          cameraType={CameraType.Back}
          scanBarcode={true}
          onReadCode={this.onBarCodeRead}
          showFrame={true}
          laserColor="red"
          frameColor="green"
          style={styles.preview}
        />

        {/* Result Info */}
        {/* {this.renderResultBox()} */}

        {/* Bottom Nav */}
        <View style={styles.bottomBarWrapper}>
          <BottomNavBar eid={this.state.eid} />

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
    bottom: 40,
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
