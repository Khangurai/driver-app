import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const [teamCode, setTeamCode] = useState("");
  const router = useRouter();

  const checkTeamCode = () => {
    if (teamCode.trim() === "001") {
      router.replace("/(app)/map");
    } else {
      Alert.alert("Access Denied", "Invalid team code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Team Code"
        value={teamCode}
        onChangeText={setTeamCode}
        keyboardType="number-pad"
      />
      <Button title="Submit Team Code" onPress={checkTeamCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
});

export default LoginScreen;