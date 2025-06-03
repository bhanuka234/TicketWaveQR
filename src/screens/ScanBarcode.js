import React, {Component} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarcodeMask from 'react-native-barcode-mask';
import {RNCamera} from 'react-native-camera';

class ScanBarcode extends Component {
  static navigationOptions = {
    title: 'Scan BarCode',
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

  componentDidMount() {
    const {eid} = this.props.route.params;
    this.setState({eid: parseInt(eid, 10)});

    // Delay to avoid crash related to getEventDispatcher
    setTimeout(() => {
      this.setState({cameraReady: true});
    }, 100);
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

    if (event.data === this.state.token_storate) {
      return;
    }

    if (event.data !== 'null') {
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
        .then(res => res.json())
        .then(resjson => {
          Alert.alert(resjson.status, resjson.msg, [
            {text: 'Continue', onPress: () => this.reset()},
          ]);

          this.setState({
            valid_ticket: resjson.status,
            name_customer: resjson.name_customer,
            seat: resjson.seat,
            checkin_time: resjson.checkin_time,
            e_cal: resjson.e_cal,
            token_storate: event.data,
          });
        })
        .catch(() => {
          Alert.alert('Error', 'Something went wrong. Please scan again.');
        });
    }
  }

  render() {
    const {
      valid_ticket,
      name_customer,
      seat,
      checkin_time,
      e_cal,
      cameraReady,
    } = this.state;

    const validJXS =
      valid_ticket === 'SUCCESS' ? (
        <View style={styles.success}>
          <Text style={styles.valid_text}>V</Text>
        </View>
      ) : valid_ticket === 'FAIL' ? (
        <View style={styles.fail}>
          <Text style={styles.valid_text}>X</Text>
        </View>
      ) : (
        <View />
      );

    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onCameraReady={() => this.setState({cameraReady: true})}
          onBarCodeRead={
            cameraReady ? this.onBarCodeRead.bind(this) : undefined
          }>
          <BarcodeMask />
        </RNCamera>

        <View style={styles.result}>
          <View style={styles.result_left}>{validJXS}</View>
          <View style={styles.result_right}>
            {name_customer ? (
              <Text style={styles.label}>
                Guest: <Text style={styles.value}>{name_customer}</Text>
              </Text>
            ) : null}
            {seat ? (
              <Text style={styles.label}>
                Seat: <Text style={styles.value}>{seat}</Text>
              </Text>
            ) : null}
            {e_cal ? (
              <Text style={styles.label}>
                Date-Time: <Text style={styles.value}>{e_cal}</Text>
              </Text>
            ) : null}
            {checkin_time ? (
              <Text style={styles.label}>
                Check-in: <Text style={styles.value}>{checkin_time}</Text>
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
