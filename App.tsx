
import React, {Component} from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import Login from './src/components/Login';
import Events from './src/components/Events';
import ListTickets from './src/components/ListTickets';
import AuthLoadingScreen from './src/components/AuthLoadingScreen';
import ScanBarcode from './src/components/ScanBarcode';


import { Text } from 'react-native';


const AuthStack = createNativeStackNavigator();
const AppNavigator = createNativeStackNavigator();



const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="AuthLoadingScreen">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="ListTickets" component={ListTickets} />
        <Stack.Screen name="ScanBarcode" component={ScanBarcode} />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

export default App;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,

        backgroundColor: '#c0d6f1'
    },
    
});

