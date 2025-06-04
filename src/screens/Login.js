import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import LoginApi from '../api/LoginApi';
import {StatusBar} from 'react-native';
import GradientButton from '../components/GradientButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomAlert from '../components/CustomAlert';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      user: '',
      pass: '',
      alertVisible: false,
      alertTitle: '',
      alertMessage: '',
      alertHideButton: false,
    };
  }

  showAlert = (title, message, hideButton = false) => {
    this.setState({
      alertVisible: true,
      alertTitle: title,
      alertMessage: message,
      alertHideButton: hideButton,
    });
  };

  hideAlert = () => {
    this.setState({alertVisible: false});
  };

  _validate() {
    const {url, user, pass} = this.state;
    if (!url || !url.trim()) {
      this.showAlert(
        'Validation Error',
        'Enter a valid Site URL (e.g. https://yourdomain.com/).',
      );
      return false;
    }
    if (!url.endsWith('/')) {
      this.showAlert(
        'Validation Error',
        'URL must end with a trailing slash (/).',
      );
      return false;
    }
    if (!user.trim()) {
      this.showAlert('Validation Error', 'Enter Email.');
      return false;
    }
    if (!pass.trim()) {
      this.showAlert('Validation Error', 'Enter Password.');
      return false;
    }
    return true;
  }

  _onLogin = async () => {
    if (!this._validate()) {
      return;
    }

    const {navigate} = this.props.navigation;
    const {url, user, pass} = this.state;

    try {
      const resjson = await LoginApi(url, user, pass);
      if (
        resjson.status === 'SUCCESS' &&
        (await this.saveToStorage(resjson.token))
      ) {
        this.showAlert('Welcome!', 'You are logged in.', true);
        setTimeout(() => {
          this.hideAlert();
          navigate('GetStart');
        }, 1500);
      } else {
        this.showAlert('Login Failed', 'Incorrect username or password.');
      }
    } catch (err) {
      console.error(err);
      this.showAlert('Error', 'Something went wrong. Please try again.');
    }
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
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <GradientBackground>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={100}
            showsVerticalScrollIndicator={false}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <View style={styles.formContainer}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subTopic}>Site Address (URL)</Text>
              <TextInput
                style={styles.input}
                placeholder="sample.com/"
                onChangeText={text => this.setState({url: text})}
                value={url}
                autoCapitalize="none"
                placeholderTextColor="#ccc"
              />
              <Text style={styles.subTopic}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="username@gmail.com"
                onChangeText={text => this.setState({user: text})}
                value={user}
                autoCapitalize="none"
                placeholderTextColor="#ccc"
              />
              <Text style={styles.subTopic}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={text => this.setState({pass: text})}
                value={pass}
                secureTextEntry
                placeholderTextColor="#ccc"
              />
              <GradientButton text="Log In" onPress={this._onLogin} />
            </View>
          </KeyboardAwareScrollView>
        </GradientBackground>
        <CustomAlert
          visible={this.state.alertVisible}
          title={this.state.alertTitle}
          message={this.state.alertMessage}
          onClose={this.hideAlert}
          hideButton={this.state.alertHideButton}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    // paddingBottom: 10,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  formContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  subTopic: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  btn: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#5C00FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;
