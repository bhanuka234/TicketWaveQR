import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import GradientBackground from '../components/GradientBackground';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';

class History extends Component {
  state = {
    tickets: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchScannedTickets();
  }
  fetchScannedTickets = async () => {
    try {
      const response = await fetch(
        'https://ticketwave.com.au/wp-json/meup/v1/tickets_checked/',
      );
      console.log('Response: ', response);
      const json = await response.json();
      if (json.status === 'SUCCESS') {
        const tickets = json.tickets.map(ticket => ({
          id: ticket.ticket_id,
          ticketNum: ticket.qr_code,
          title: ticket.event_title,
          customerName: ticket.customer_name,
        }));
        this.setState({tickets, loading: false});
      } else {
        console.error('Error fetching tickets');
        this.setState({loading: false});
      }
    } catch (error) {
      this.setState({loading: false});
      throw new Error(console.log('Error: ', error));
    }
  };

  renderTicket = ({item}) => {
    return (
      <View style={styles.cardStyle}>
        <View style={styles.cardActions}>
          <View style={styles.qrRow}>
            <Image
              source={require('../assets/qrCode.png')}
              style={styles.qrCode}
              resizeMode="contain"
            />
            {/*  */}
            <Text style={styles.ticketTitle}>{item.title}</Text>
          </View>
          {/* <Text style={styles.ticketLabel}>QR Code:</Text> */}
          <Text style={styles.qrValue}>{item.ticketNum}</Text>
          <Text style={styles.qrValue}>{item.customerName}</Text>
        </View>

        {/* Second row: Date aligned to the right */}
        <View style={styles.dateRow}>
          <Text style={styles.ticketDetails2}>10.47pm</Text>
          {/* <Text style={styles.ticketDetails2}>{item.id}</Text> */}
        </View>

        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('TicketView', {
          ticketId: item.id,
          ticketNum: item.ticketNum,
          eventTitle: item.title,
          customerName: item.customerName,
          date: '10.47pm',
        })}>
          <Text style={styles.showTicketText}>View Details</Text>
        </TouchableOpacity>
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
              <TouchableOpacity onPress={this.handleBack}>
                <View style={styles.backContent}>
                  <Image
                    source={require('../assets/back.png')}
                    resizeMode="contain"
                  />
                  <Text style={styles.backText}>History</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Ticket cards list */}
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('TicketView')
              }>
              {this.state.loading ? (
                <ActivityIndicator
                  size="70"
                  color="#ffffff"
                  style={styles.spinner}
                />
              ) : (
                <FlatList
                  data={this.state.tickets}
                  renderItem={this.renderTicket}
                  keyExtractor={item => item.id.toString()}
                  contentContainerStyle={styles.cardContainer}
                />
              )}
            </TouchableOpacity>
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
    flexDirection: 'column',
    gap: 8,
  },

  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 5,
  },

  ticketLabel: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },

  qrValue: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    flexWrap: 'wrap',
  },
  qrCode: {
    width: 30,
    height: 30,
  },
  ticketDetails: {
    fontSize: 15,
    color: '#fff',
    flex: 1,
    // marginLeft: 10,
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
  spinner: {
    marginBottom: 10,
  },
  showTicketText: {
    color: '#FF71D2',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default History;
