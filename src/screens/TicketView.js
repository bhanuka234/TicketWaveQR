import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "../components/GradientBackground";
import BottomNavBar from "../components/BottomNavBar";
import TicketDetail from "../api/TicketDetails";

class TicketView extends Component {
  state = {
    ticketData: null,
    loading: true,
  };

  async componentDidMount() {
  const { ticketNum } = this.props.route?.params || {};

  try {
    const ticket = await TicketDetail(ticketNum);

    if (ticket) {
      this.setState({
        ticketData: ticket,
        loading: false,
      });
    } else {
      this.setState({ loading: false });
      Alert.alert("Error", "Failed to load ticket details.");
    }
  } catch (err) {
    console.error('❌ Error loading ticket detail:', err);
    this.setState({ loading: false });
    Alert.alert("Error", "Something went wrong.");
  }
}

  handleBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { loading, ticketData } = this.state;

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
                    source={require("../assets/back.png")}
                    resizeMode="contain"
                  />
                  <Text style={styles.backText}>Ticket View</Text>
                </View>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
            ) : ticketData ? (
              <View style={styles.ticketCard}>
                <View style={styles.ticketRow}>
                  <Image
                    source={require("../assets/qrCode.png")}
                    style={styles.qrIcon}
                  />
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketText}>{ticketData.event_title}</Text>
                    <Text style={styles.ticketText}>{ticketData.qr_code}</Text>
                    <Text style={styles.ticketText}>{ticketData.customer_name}</Text>
                    <Text style={styles.ticketDate}>{ticketData.checkin_time}</Text>
                  </View>
                </View>

                <View style={styles.line} />

                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text style={styles.infoLabel}>Type</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoValueApproved}>{ticketData.ticket_status}</Text>
                    <Text style={styles.infoValueGold}>{ticketData.ticket_type || "N/A"}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <Text style={{ color: 'white', marginTop: 50 }}>No ticket data found.</Text>
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
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -50,
  },
  backContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 25,
    color: "#FF71D2",
    fontWeight: "500",
    marginLeft: -30,
  },
  ticketCard: {
    backgroundColor: "#2c2c2c",
    borderRadius: 10,
    padding: 20,
  },
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qrIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginBottom: 80,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  ticketDate: {
    color: "#CCCCCC",
    fontSize: 14,
    // marginLeft: 150,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  infoValueApproved: {
    color: "green",
    fontSize: 16,
    fontWeight: "500",
  },
  infoValueGold: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "500",
  },
  showQr: {
    color: "#FF71D2",
    fontWeight: "600",
    fontSize: 18,
    marginTop: 15,
    textAlign: "center",
  },
});

export default TicketView;
