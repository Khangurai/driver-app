import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import { supabase } from "../services/supabase";
import { useAuth } from "./context/AuthContext";

export default function LoginScreen() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (loading) return;

    const trimmedUsername = userName.trim();
    if (!trimmedUsername) {
      Alert.alert("Login Failed", "Please enter a username.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("fleet_mag")
        .select("*")
        .eq("d_username", trimmedUsername)
        .single();

      if (error || !data) {
        Alert.alert("Login Failed", "User not found.");
        setLoading(false);
        return;
      }

      login({
        id: data.id.toString(),
        username: data.d_username,
        driver: data.driver,
        car_number: data.car_number,
        capacity: data.capacity,
      });

      router.replace("/(tabs)");
    } catch (err) {
      console.error(err);
      Alert.alert("Login Failed", "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Driver Login</Title>
      <TextInput
        label="Username"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
        autoCapitalize="none"
        mode="outlined"
        disabled={loading}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={!userName.trim() || loading}
      >
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: { marginBottom: 16 },
});
