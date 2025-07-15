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
import AsyncStorage from '@react-native-async-storage/async-storage';

class History extends Component {
  state = {
    tickets: [],
    loading: true,
  };

  async componentDidMount() {
    let eid = this.props.route?.params?.eid;
    if (!eid) {
      const storedEid = await AsyncStorage.getItem('@selectedEid');
      if (storedEid) {
        eid = parseInt(storedEid);
      }
    }
    this.fetchScannedTickets(eid);
  }

  fetchScannedTickets = async (eid = null) => {
    try {
      const token = await AsyncStorage.multiGet(['@url', '@token']);
      const url = token[0][1];
      const authToken = token[1][1];

      let response;
      if (eid) {
        // Filtered by Event
        response = await fetch(`${url}wp-json/meup/v1/tickets_by_events/`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eid: eid,
            token: authToken,
          }),
        });
      }

      const json = await response.json();

      if (json.status === 'SUCCESS') {
        const event = json.events[0];

        const tickets = (event?.tickets || [])
          .filter(ticket => ticket.ticket_status === 'checked')
          .map(ticket => ({
            id: ticket.ticket_id,
            ticketNum: ticket.qr_code,
            eventTitle: eid ? json.events[0].event_title : ticket.event_title,
            customerName: ticket.customer_name,
          }));

        this.setState({tickets, loading: false});
      } else {
        console.error('Failed to load tickets');
        this.setState({loading: false});
      }
    } catch (error) {
      console.error('Fetch error:', error);
      this.setState({loading: false});
    }
  };

  renderTicket = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate('TicketView', {
          ticketId: item.id,
          ticketNum: item.ticketNum,
          eventTitle: item.eventTitle,
          customerName: item.customerName,
          date: '10.47pm',
        })
      }>
      <View style={styles.cardStyle}>
        <View style={styles.cardActions}>
          <View style={styles.qrRow}>
            <Image
              source={require('../assets/qrCode.png')}
              style={styles.qrCode}
              resizeMode="contain"
            />
            {/*  */}
            <Text
              style={styles.ticketTitle}
              numberOfLines={1}
              ellipsizeMode="middle">
              {item.ticketNum}
            </Text>
          </View>
        </View>

        {/* Second row: Date aligned to the right */}
        <View style={styles.dateRow}>
          <Text style={styles.ticketDetails2}>10.47pm</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
              <Text style={styles.backText}>History</Text>
            </View>

            {/* Ticket cards list */}
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
    justifyContent: 'center',
    marginRight: 200,
    marginTop: 20,
    marginBottom: 30,
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
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },

  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 5,
    marginLeft: 10,
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
    marginTop: 100,
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
