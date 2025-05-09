import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, Volunteer!</Text>
      <Text style={styles.subtext}>Check Available and Accepted Orders</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  subtext: { fontSize: 16, color: '#555' },
});
