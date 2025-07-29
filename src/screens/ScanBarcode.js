import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  StatusBar,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, CameraType } from 'react-native-camera-kit';
import BottomNavBar from '../components/BottomNavBar';
import CustomAlert from '../components/CustomAlert';

const { width, height } = Dimensions.get('window');

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

      // Custom alert states
      showCustomAlert: false,
      alertTitle: '',
      alertMessage: '',
      alertType: '', // success / fail
    };
  }

  async componentDidMount() {
    console.log('🚀 Component mounted');
    await this.loadSettings();

    const eidFromParams = this.props.route?.params?.eid;
    if (eidFromParams) {
      await AsyncStorage.setItem('@selectedEid', eidFromParams.toString());
      this.setState({ eid: eidFromParams });
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
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      const isCameraGranted =
        cameraGranted === PermissionsAndroid.RESULTS.GRANTED;
      console.log('📷 Camera permission granted:', isCameraGranted);
      this.setState({ cameraPermissionGranted: isCameraGranted });
    } else {
      console.log('📷 iOS assumed camera permission granted');
      this.setState({ cameraPermissionGranted: true });
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

  showCustomAlert = (title, message, type) => {
    this.setState({
      showCustomAlert: true,
      alertTitle: title,
      alertMessage: message,
      alertType: type,
    });
  };

  hideCustomAlert = () => {
    this.setState({ showCustomAlert: false }, () => {
      this.resetScan();
    });
  };

  onBarCodeRead = async event => {
    const scannedCode = event.nativeEvent?.codeStringValue;
    console.log('📸 QR scanned:', scannedCode);

    const { scanning, token_storate, token, url, eid } = this.state;

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
        this.showCustomAlert(
          'SUCCESS',
          `Name: ${resjson.name_customer}\nTicket Type: ${resjson.ticket_type}`,
          'success'
        );
      }
      else {
        this.showCustomAlert('FAIL', resjson.msg, 'fail');
      }

      this.setState({
        valid_ticket: resjson.status,
        name_customer: resjson.name_customer,
        seat: resjson.seat,
        checkin_time: resjson.checkin_time,
        e_cal: resjson.e_cal,
        token_storate: scannedCode,
        ticket_type: resjson.ticket_type,
      });
    } catch (error) {
      console.log('❌ Scan request failed:', error);
      this.showCustomAlert('Error', 'Scan failed. Please try again.', 'fail');
    }
  };

  render() {
    if (!this.state.cameraPermissionGranted) {
      return (
        <View style={styles.container}>
          <Text style={styles.camPermission}>
            Camera permission not granted.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

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

        {/* Bottom Nav */}
        <View style={styles.bottomBarWrapper}>
          <BottomNavBar eid={this.state.eid} />
        </View>

        {/* Custom Alert */}
        <CustomAlert
          visible={this.state.showCustomAlert}
          title={this.state.alertTitle}
          message={this.state.alertMessage}
          onClose={this.hideCustomAlert}
          onConfirm={this.hideCustomAlert}
          showCancel={false}
          confirmText="OK"
        />
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
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camPermission: {
    textAlign: 'center',
    marginTop: height * 0.2,
    color: 'black',
  },
});

export default ScanBarcode;
