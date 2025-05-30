import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';

import checkLogin from '../api/checkLogin';
import getToken from '../api/getToken';
import LoginApi from '../api/LoginApi';

class Login extends Component {
  static navigationOptions = {
    title: 'Log In',
  };

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      user: '',
      pass: '',
    };
  }

  _validate() {
    const {url, user, pass} = this.state;
    if (url == '') {
      alert('Enter Url, ex: https://yourdomain.com/ ');
      return false;
    }

    if (url.endsWith('/') == false) {
      alert('Insert character / at the bottom of domain ');
      return false;
    }

    if (user == '') {
      alert('Enter User');
      return false;
    }

    if (pass == '') {
      alert('Enter Password');
      return false;
    }
  }

  _onLogin = async () => {
    this._validate();

    const {navigate} = this.props.navigation;

    const {url, user, pass} = this.state;

    await LoginApi(url, user, pass)
      .then(resjson => {
        if (resjson.status === 'SUCCESS' && this.saveToStorage(resjson.token)) {
          Alert.alert('Login', resjson.msg);
          navigate('GetStart');
        } else if (resjson.status === 'FAIL') {
          alert(resjson.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  async saveToStorage(token) {
    if (token) {
      await AsyncStorage.setItem('@token', token);
      await AsyncStorage.setItem('@isLoggedIn', '1');
      await AsyncStorage.setItem('@url', this.state.url);

      return true;
    }

    return false;
  }

  render() {
    const {url, user, pass} = this.state;

    return (
      <GradientBackground>
        <View style={styles.container}>
          <Image source={require('../assets/logo.png')} styles={styles.logo} />
          <TextInput
            style={styles.input}
            placeholder="Site address (URL)"
            onChangeText={text => this.setState({url: text})}
            autoCapitalize="none"
            value={url}
            placeholderTextColor="#666666"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={text => this.setState({user: text})}
            value={user}
            placeholderTextColor="#666666"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={text => this.setState({pass:text})}
            value={pass}
            secureTextEntry
            keyboardType="default"
            placeholderTextColor="#666666"
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={this._onLogin.bind(this)}>
            <Text style={styles.btn_text}>Log In</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  input: {
    height: 40,
    width: 250,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333333',
  },
  btn: {
    height: 40,
    width: 120,
    backgroundColor: '#e86c60',
    borderColor: '#e86c60',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  btn_text: {
    color: '#fff',
    fontSize: 16,
    borderRadius: 5,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
    alignSelf: 'center',
  },
});

export default Login;
