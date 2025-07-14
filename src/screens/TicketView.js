import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import GradientBackground from '../components/GradientBackground';

class TicketView extends Component {
  handleBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const { ticketId, ticketNum, eventTitle, customerName, date } = this.props.route.params;
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
                  <Text style={styles.backText}>Ticket View</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* Ticket Details Card */}
            <View style={styles.ticketCard}>
              {/* QR Icons and Ticket Info */}
              <View style={styles.ticketRow}>
                <Image
                  source={require('../assets/qrCode.png')}
                  style={styles.qrIcon}
                />
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketText}>{eventTitle}</Text>
                  <Text style={styles.ticketText}>{ticketNum}</Text>
                  <Text style={styles.ticketText}>{customerName}</Text>
                  <Text style={styles.ticketDate}>{date}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.line} />

              {/* Status & Type */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={styles.infoLabel}>Type</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoValueApproved}>Approved</Text>
                  <Text style={styles.infoValueGold}>GOLD</Text>
                </View>
              </View>

              {/* Show QR Code Button */}
              {/* <TouchableOpacity>
                <Text style={styles.showQr}>Show QR Code</Text>
              </TouchableOpacity> */}
            </View>
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
    fontWeight: '500',
    marginLeft: -30,
  },
  ticketCard: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 20,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  ticketDate: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 5,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  infoValueApproved: {
    color: 'green',
    fontSize: 16,
    fontWeight: '500',
  },
  infoValueGold: {
    color: '#FFD700', // Gold color
    fontSize: 16,
    fontWeight: '500',
  },
  showQr: {
    color: '#FF71D2',
    fontWeight: '600',
    fontSize: 18,
    marginTop: 15,
    textAlign: 'center',
  },
});

export default TicketView;
