import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const GradientButton = ({onPress, text, style, textStyle}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.btnStyles}>
      <LinearGradient
        colors={['#6A11CB', '#2575FC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.button, style]}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

GradientButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  button: {
    height: height * 0.05,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyles:{
    marginVertical: 5,
  },
  text: {
    color: '#fff',
    fontSize: RFValue(13),
    fontWeight: '600',
  },
});

export default GradientButton;
