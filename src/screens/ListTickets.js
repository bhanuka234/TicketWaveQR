import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Text, Button, TouchableOpacity,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from "../components/GradientBackground";


class ListTickets extends Component {

  static navigationOptions = {
        title: 'List Tickets',
  };

    constructor(props) {
        
        super(props);
        this.state = { eid: [] };

    }

    componentDidMount() {
      
      const { navigation } = this.props;
      this.setState({eid: parseInt( JSON.stringify(this.props.route.params.eid) ) })
        
    }

     async logout(){

      await AsyncStorage.setItem( '@token', '' );
      await AsyncStorage.setItem( '@isLoggedIn', '0' );
      this.props.navigation.navigate('Login');
    }

    render() {
        
         return (

	  <GradientBackground>
          <View style={styles.container}>
            
             <View style={styles.heading}>
          
                <Text style={styles.heading}>{this.props.route.params.title }</Text>
                
              </View>

           <TouchableOpacity
  style={styles.scan}
  onPress={() => this.props.navigation.navigate('ScanBarcode', { eid: this.state.eid })}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={require('../assets/scannericon.png')}
      style={{ width: 20, height: 20, marginRight: 8 }}
    />
    <Text style={{ color: '#fff' }}>Scan</Text>
  </View>
</TouchableOpacity>
                   
          </View>
</GradientBackground>
        )
        
    }

}

const styles = StyleSheet.create({
   container: {
      flex: 1,
    
    padding: 5,
    },
    
    heading: {
      
      flexDirection: 'row',
      backgroundColor: 'transparent',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 10,
      padding: 10

    }
});


export default ListTickets;
