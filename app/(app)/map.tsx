import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  IconButton,
  Text,
  TextInput,
  Title,
} from "react-native-paper";
import { supabase } from "../../services/supabase";

const MapScreen = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [pickupEnabled, setPickupEnabled] = useState(false);
  const [users, setUsers] = useState([]);
  const [lastReloadTime, setLastReloadTime] = useState(null);

  // 🔹 Fetch users from Supabase
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, latitude, longitude, status")
      .order("id", { ascending: true });

    if (error) Alert.alert("Error fetching users", error.message);
    else {
      setUsers(
        data.map((u) => ({
          name: u.name,
          lat: parseFloat(u.latitude),
          lng: parseFloat(u.longitude),
          status: u.status,
        }))
      );
      setLastReloadTime(new Date());
    }
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
    setLatitude("");
    setLongitude("");
    setPickupEnabled(false);
    Alert.alert("Reset", "Location cleared.");
  };

  const openGoogleMaps = async () => {
    if (!latitude || !longitude) {
      Alert.alert("Error", "Get or enter location first.");
      return;
    }

    // Only include active users (status: true) in directions
    const activeUsers = users.filter((u) => u.status === true);

    if (activeUsers.length === 0) {
      Alert.alert("No Active Users", "No active users available for route.");
      return;
    }

    const origin = `${latitude},${longitude}`;
    const destination = `${activeUsers[activeUsers.length - 1]?.lat},${
      activeUsers[activeUsers.length - 1]?.lng
    }`;
    const waypoints = activeUsers
      .slice(0, -1)
      .map((u) => `${u.lat},${u.lng}`)
      .join("|");

    const googleMapsAppUrl = `comgooglemaps://?saddr=${origin}&daddr=${destination}&waypoints=${encodeURIComponent(
      waypoints
    )}`;
    const googleMapsWebUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${encodeURIComponent(
      waypoints
    )}`;

    try {
      const supported = await Linking.canOpenURL(googleMapsAppUrl);
      if (supported) await Linking.openURL(googleMapsAppUrl);
      else await Linking.openURL(googleMapsWebUrl);
      setPickupEnabled(true);
    } catch (err) {
      Alert.alert("Error opening maps", err.message);
    }
  };

  const confirmPickup = () => {
    Alert.alert("Trip Completed", "Pickup confirmed!");
    setPickupEnabled(false);
    setLatitude("");
    setLongitude("");
  };

  return (
    <View style={styles.fullContainer}>
      {/* App Header/Nav Bar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>🚗 Pickup Routes</Text>
          <Text style={styles.headerSubtitle}>Plan your journey</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Location Input Section */}
        <View style={styles.locationSection}>
          <TextInput
            label="Latitude"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            dense
          />
          <TextInput
            label="Longitude"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            dense
          />

          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={getUserLocation}
              style={styles.smallButton}
              compact
            >
              Get Location
            </Button>
            <Button
              mode="outlined"
              onPress={resetLocation}
              style={styles.smallButton}
              compact
            >
              Reset
            </Button>
          </View>

          {latitude && longitude && (
            <Text style={styles.coords}>
              📍 {parseFloat(latitude).toFixed(4)},{" "}
              {parseFloat(longitude).toFixed(4)}
            </Text>
          )}
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionSection}>
          <Button
            mode="contained"
            onPress={openGoogleMaps}
            buttonColor="#388e3c"
            style={styles.actionButton}
            icon="map"
            compact
          >
            Start Route ({users.filter((u) => u.status).length} stops)
          </Button>
          <Button
            mode="contained"
            onPress={confirmPickup}
            disabled={!pickupEnabled}
            buttonColor="#1976d2"
            style={styles.actionButton}
            icon="check"
            compact
          >
            Confirm Pickup
          </Button>
        </View>

        <Divider style={styles.divider} />

        {/* Users Section */}
        <View style={styles.usersSection}>
          <View style={styles.usersHeader}>
            <View style={styles.titleSection}>
              <Title style={styles.sectionTitle}>
                Users ({users.filter((u) => u.status).length}/{users.length}{" "}
                active)
              </Title>
              {lastReloadTime && (
                <Text style={styles.lastReloadText}>
                  Last updated: {lastReloadTime.toLocaleDateString()}{" "}
                  {lastReloadTime.toLocaleTimeString()}
                </Text>
              )}
            </View>
            <IconButton
              icon="reload"
              size={20}
              onPress={fetchUsers}
              style={styles.refreshButton}
            />
          </View>

          <View style={styles.usersList}>
            {users.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <Text style={styles.emptyText}>No users found</Text>
                </Card.Content>
              </Card>
            ) : (
              users.map((u, idx) => (
                <Card
                  key={idx}
                  style={[styles.userCard, !u.status && styles.inactiveCard]}
                >
                  <Card.Content style={styles.userContent}>
                    <View style={styles.userInfo}>
                      <Text
                        style={[
                          styles.userName,
                          !u.status && styles.inactiveText,
                        ]}
                      >
                        {u.name}
                      </Text>
                      <Text
                        style={[
                          styles.userLocation,
                          !u.status && styles.inactiveText,
                        ]}
                      >
                        📍 {u.lat.toFixed(4)}, {u.lng.toFixed(4)}
                      </Text>
                    </View>
                    <View style={styles.userStatus}>
                      <Text
                        style={[
                          styles.userIndex,
                          !u.status && styles.inactiveText,
                        ]}
                      >
                        #{idx + 1}
                      </Text>
                      <Text
                        style={[
                          styles.statusBadge,
                          u.status ? styles.activeBadge : styles.inactiveBadge,
                        ]}
                      >
                        {u.status ? "🟢 Active" : "🔴 Inactive"}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // Header/Nav Bar
  header: {
    backgroundColor: "#fff",
    paddingTop: 50, // For status bar
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerContent: {
    alignItems: "center",
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Extra space for bottom navigation
  },

  // Location Section
  locationSection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    marginVertical: 4,
    height: 45, // Reduced height
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
  smallButton: {
    flex: 1,
    height: 36, // Smaller button height
  },
  coords: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },

  // Action Section
  actionSection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    gap: 8,
  },
  actionButton: {
    height: 40, // Reduced button height
  },

  divider: {
    marginVertical: 16,
    backgroundColor: "#e0e0e0",
  },

  // Users Section
  usersSection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  usersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 2,
  },
  lastReloadText: {
    fontSize: 11,
    color: "#888",
    fontStyle: "italic",
  },
  refreshButton: {
    margin: 0,
    marginTop: -4,
  },

  // Users List
  usersList: {
    gap: 6, // Space between user cards
  },
  userCard: {
    marginBottom: 0, // Remove margin since we use gap
    elevation: 1,
    borderRadius: 6,
  },
  userContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  userLocation: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  userStatus: {
    alignItems: "flex-end",
  },
  userIndex: {
    fontSize: 12,
    color: "#888",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    textAlign: "center",
    marginBottom: 4,
  },
  statusBadge: {
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  activeBadge: {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
  },
  inactiveBadge: {
    backgroundColor: "#ffebee",
    color: "#c62828",
  },

  // Inactive User Styles
  inactiveCard: {
    backgroundColor: "#f5f5f5",
    opacity: 0.6,
  },
  inactiveText: {
    color: "#999",
  },

  // Empty State
  emptyCard: {
    backgroundColor: "#fafafa",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  emptyContent: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
  },
});

export default MapScreen;
