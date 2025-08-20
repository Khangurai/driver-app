import React, { useState } from "react";
import { Alert, Button, Linking, View, Text, TextInput, StyleSheet } from "react-native";
import * as Location from "expo-location";

const MapScreen = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [pickupEnabled, setPickupEnabled] = useState(false);

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

    const waypoints =
      "16.912737490913642,96.16598476643031/16.90541772192416,96.16223168100738/16.894368475758945,96.15660205287303/16.868123922963115,96.15515855847958/16.851546537281294,96.20019558355462/16.83427688172054,96.15486985962633/16.82750674711277,96.15732380009516/16.806642157516247,96.15674640269384/16.803853392137157,96.13503888725135/16.816132425005865,96.1277866600959";

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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />

      <View style={styles.buttonGroup}>
        <Button title="Get My Current Location" onPress={getUserLocation} />
        <Button title="Reset Location" onPress={resetLocation} color="red" />
      </View>

      {latitude && longitude ? (
        <Text style={styles.coords}>
          Current Location: 
Lat: {latitude} 
Lng: {longitude}
        </Text>
      ) : null}

      <Button title="Start Route in Google Maps" onPress={openGoogleMaps} color="green" />

      <View style={{ marginTop: 10 }}>
        <Button title="Confirm Pickup" onPress={confirmPickup} disabled={!pickupEnabled} color="blue" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", marginTop: 20, padding: 16 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  coords: { marginTop: 15, fontSize: 16, textAlign: "center" },
});

export default MapScreen;
