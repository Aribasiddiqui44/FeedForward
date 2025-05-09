import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SuccessScreen = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.push('volunteer/availableOrders'); // or any appropriate route
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.message}>
          You have successfully registered as a volunteer on Feed Forward.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  box: { backgroundColor: '#fff', padding: 24, borderRadius: 12, alignItems: 'center', elevation: 5 },
  checkmark: { fontSize: 48, color: 'green', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  message: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#5FD1AE', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 25 },
  buttonText: { color: '#fff', fontSize: 16 },
});
