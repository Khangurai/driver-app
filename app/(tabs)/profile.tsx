import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../services/supabase";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { session, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!session) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("fleet_mag")
        .select("*")
        .eq("d_username", session.user.username)
        .single();

      if (error) {
        console.error(error);
        Alert.alert("Error", "Could not fetch profile data.");
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [session]);

  const handleLogout = () => {
    logout();
    router.replace("../login");
    Alert.alert("Logged Out", "You have been successfully logged out.");
  };

  if (!profile) return <Text style={{ textAlign: "center", marginTop: 50 }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Profile</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Driver Name:</Text>
        <Text style={styles.info}>{profile.driver}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Car Number:</Text>
        <Text style={styles.info}>{profile.car_number}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Capacity:</Text>
        <Text style={styles.info}>{profile.capacity}</Text>
      </View>

      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  infoContainer: { flexDirection: "row", justifyContent: "space-between", width: "80%", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  label: { fontSize: 16, fontWeight: "500", color: "#333" },
  info: { fontSize: 16, color: "#666" },
});
