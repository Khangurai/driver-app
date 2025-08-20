import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you'd clear auth tokens here
    router.replace('/');
    Alert.alert('Logged Out', 'You have been successfully logged out.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Driver Name:</Text>
        <Text style={styles.info}>John Doe</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Team Code:</Text>
        <Text style={styles.info}>001</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Vehicle ID:</Text>
        <Text style={styles.info}>ZAP-123</Text>
      </View>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileScreen;