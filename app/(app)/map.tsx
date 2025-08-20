import React, { useState } from "react";
import { Alert, Linking, View, ScrollView, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { TextInput, Button, Text, Card, Title, Divider, IconButton } from "react-native-paper";

const initialUsers = [
  { name: "Aung Kyaw", lat: 16.776474, lng: 96.171004 },
  { name: "Kyaw Thaung", lat: 16.77122, lng: 96.175772 },
  { name: "Zaw Min", lat: 16.776539, lng: 96.168959 },
  { name: "Mya Hnin", lat: 16.778781, lng: 96.16733 },
  { name: "Ko Ko", lat: 16.78585, lng: 96.161588 },
  { name: "Aye Chan", lat: 16.786012, lng: 96.14788 },
  { name: "Soe Win", lat: 16.779877, lng: 96.143969 },
  { name: "Hla Hla", lat: 16.780137, lng: 96.13744 },
  { name: "Thura", lat: 16.780642, lng: 96.131666 },
  { name: "Than Myint", lat: 16.793038, lng: 96.122994 },
  { name: "Moe Moe", lat: 16.802123, lng: 96.122292 },
  { name: "Aung Aung", lat: 16.803815, lng: 96.12437 },
  { name: "Khin Khin", lat: 16.803723, lng: 96.133336 },
  { name: "Nay Lin", lat: 16.804693, lng: 96.133012 },
  { name: "Wai Yan", lat: 16.815558, lng: 96.128566 },
];

const MapScreen = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [pickupEnabled, setPickupEnabled] = useState(false);
  const [users, setUsers] = useState(initialUsers);

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setLatitude(latitude.toString());
    setLongitude(longitude.toString());
  };

  const resetLocation = () => {
    setLatitude("");
    setLongitude("");
    setPickupEnabled(false);
    Alert.alert("Reset", "Location has been cleared.");
  };

  const openGoogleMaps = async () => {
    if (!latitude || !longitude) {
      Alert.alert("Error", "Please get or enter a location first.");
      return;
    }

    const waypoints = users.map(u => `${u.lat},${u.lng}`).join("/");
    const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${waypoints}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      setPickupEnabled(true);
    } else {
      Alert.alert("Error", "Can't open Google Maps");
    }
  };

  const confirmPickup = () => {
    Alert.alert("Trip Completed", "You have confirmed the pickup. End of trip!");
    setPickupEnabled(false);
    setLatitude("");
    setLongitude("");
  };

  const reloadUsers = () => {
    setUsers([...initialUsers]);
    Alert.alert("Users reloaded");
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.buttonGroup}>
        <Button mode="contained" onPress={getUserLocation} style={styles.button}>
          Get My Current Location
        </Button>
        <Button mode="contained" onPress={resetLocation} buttonColor="#d32f2f" style={styles.button}>
          Reset Location
        </Button>
      </View>

      {latitude && longitude && (
        <Text style={styles.coords}>
          Current Location:{"\n"}Lat: {latitude}{"\n"}Lng: {longitude}
        </Text>
      )}

      <Button mode="contained" onPress={openGoogleMaps} buttonColor="#388e3c" style={{ marginVertical: 10 }}>
        Start Route in Google Maps
      </Button>

      <Button mode="contained" onPress={confirmPickup} disabled={!pickupEnabled} buttonColor="#1976d2">
        Confirm Pickup
      </Button>

      <Divider style={{ marginVertical: 20 }} />

      {/* Users Header with Reload Icon */}
      <View style={styles.usersHeader}>
        <Title style={{ marginBottom: 10 }}>Users (Team001)</Title>
        <IconButton
          icon="reload"
          size={24}
          onPress={reloadUsers}
          style={{ marginBottom: 10 }}
        />
      </View>

      {users.map((user, index) => (
        <Card key={index} style={styles.userCard}>
          <Card.Content>
            <Text style={{ fontWeight: "600" }}>{user.name}</Text>
            <Text style={{ color: "#555" }}>{user.lat},{user.lng}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { marginVertical: 8 },
  buttonGroup: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  button: { flex: 1, marginHorizontal: 4 },
  coords: { marginTop: 15, fontSize: 16, textAlign: "center" },
  usersHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  userCard: { marginBottom: 8 },
});

export default MapScreen;
