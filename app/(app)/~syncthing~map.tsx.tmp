import React, { useState, useEffect } from "react";
import { Alert, ScrollView, View, Linking, StyleSheet } from "react-native";
import { Button, Card, Divider, IconButton, Text, TextInput, Title } from "react-native-paper";
import * as Location from "expo-location";
import {supabase} from "../../services/supabase"
 
const MapScreen = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [pickupEnabled, setPickupEnabled] = useState(false);
  const [users, setUsers] = useState([]);

  // 🔹 Fetch users from Supabase
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, latitude, longitude, status")
      .eq("status", true)
      .order("id", { ascending: true });

    if (error) Alert.alert("Error fetching users", error.message);
    else setUsers(data.map(u => ({ name: u.name, lat: parseFloat(u.latitude), lng: parseFloat(u.longitude) })));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude.toString());
    setLongitude(location.coords.longitude.toString());
  };

  const resetLocation = () => {
    setLatitude(""); setLongitude(""); setPickupEnabled(false);
    Alert.alert("Reset", "Location cleared.");
  };

  const openGoogleMaps = async () => {
    if (!latitude || !longitude) { Alert.alert("Error", "Get or enter location first."); return; }
    const origin = `${latitude},${longitude}`;
    const destination = `${users[users.length - 1]?.lat},${users[users.length - 1]?.lng}`;
    const waypoints = users.slice(0, -1).map(u => `${u.lat},${u.lng}`).join("|");

    const googleMapsAppUrl = `comgooglemaps://?saddr=${origin}&daddr=${destination}&waypoints=${encodeURIComponent(waypoints)}`;
    const googleMapsWebUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${encodeURIComponent(waypoints)}`;

    try {
      const supported = await Linking.canOpenURL(googleMapsAppUrl);
      if (supported) await Linking.openURL(googleMapsAppUrl);
      else await Linking.openURL(googleMapsWebUrl);
      setPickupEnabled(true);
    } catch (err) { Alert.alert("Error opening maps", err.message); }
  };

  const confirmPickup = () => { Alert.alert("Trip Completed", "Pickup confirmed!"); setPickupEnabled(false); setLatitude(""); setLongitude(""); };

  return (
    <ScrollView style={styles.container}>
      <TextInput label="Latitude" value={latitude} onChangeText={setLatitude} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label="Longitude" value={longitude} onChangeText={setLongitude} keyboardType="numeric" mode="outlined" style={styles.input} />

      <View style={styles.buttonGroup}>
        <Button mode="contained" onPress={getUserLocation} style={styles.button}>Get My Location</Button>
        <Button mode="contained" onPress={resetLocation} buttonColor="#d32f2f" style={styles.button}>Reset</Button>
      </View>

      {latitude && longitude && <Text style={styles.coords}>Lat: {latitude}{"\n"}Lng: {longitude}</Text>}

      <Button mode="contained" onPress={openGoogleMaps} buttonColor="#388e3c" style={{ marginVertical: 10 }}>Start Route</Button>
      <Button mode="contained" onPress={confirmPickup} disabled={!pickupEnabled} buttonColor="#1976d2">Confirm Pickup</Button>

      <Divider style={{ marginVertical: 20 }} />

      <View style={styles.usersHeader}>
        <Title>Users</Title>
        <IconButton icon="reload" size={24} onPress={fetchUsers} />
      </View>

      {users.map((u, idx) => (
        <Card key={idx} style={styles.userCard}>
          <Card.Content>
            <Text style={{ fontWeight: "600" }}>{u.name}</Text>
            <Text style={{ color: "#555" }}>{u.lat},{u.lng}</Text>
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
