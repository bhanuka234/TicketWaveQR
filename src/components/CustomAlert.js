// components/CustomAlert.js
import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const CustomAlert = ({visible, title, message, onClose, hideButton = false}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          {!hideButton &&(
            <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: '#5C00FF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  okButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomAlert;
