import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import GradientBackground from '../components/GradientBackground';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';

class History extends Component {
  state = {
    tickets: [
      {id: 1, ticketNum: '#TicketNum12345', date: '16 Dec 2022, 9.30 pm'},
      {id: 2, ticketNum: '#TicketNum12346', date: '17 Dec 2022, 10:00 pm'},
      {id: 3, ticketNum: '#TicketNum12347', date: '18 Dec 2022, 7.15 pm'},
      {id: 4, ticketNum: '#TicketNum12348', date: '19 Dec 2022, 9.30 pm'},
      {id: 5, ticketNum: '#TicketNum12349', date: '20 Dec 2022, 8.30 pm'},
      {id: 6, ticketNum: '#TicketNum12350', date: '21 Dec 2022, 10.30 pm'},
    ],
  };

  renderTicket = ({item}) => {
    return (
      <View style={styles.cardStyle}>
        <View style={styles.cardActions}>
          {/* QR code */}
          <Image
            source={require('../assets/qrCode.png')}
            style={styles.qrCode}
            resizeMode="contain"
          />

          {/* Ticket details (ticket number) */}
          <Text style={styles.ticketDetails}>{item.ticketNum}</Text>

          {/* Delete button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => this.deleteTicket(item.id)}>
            <Image
              source={require('../assets/delete.png')}
              style={styles.deleteIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Second row: Date aligned to the right */}
        <View style={styles.dateRow}>
          <Text style={styles.ticketDetails2}>{item.date}</Text>
        </View>
      </View>
    );
  };

  handleBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <GradientBackground>
          <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={this.handleBack}
                style={styles.backBtn}>
                <View style={styles.backContent}>
                  <Image
                    source={require('../assets/back.png')}
                    style={styles.backIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.backText}>History</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Ticket cards list */}
            <FlatList
              data={this.state.tickets}
              renderItem={this.renderTicket}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.cardContainer}
            />

            <BottomNavBar />
          </SafeAreaView>
        </GradientBackground>
      </>
    );
  }
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -50,
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
  cardStyle: {
    backgroundColor: '#2c2c2c',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrCode: {
    width: 30,
    height: 30,
  },
  ticketDetails: {
    fontSize: 15,
    color: '#fff',
    flex: 1,
    marginLeft: 10,
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  ticketDetails2: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'right',
  },
});

export default History;
