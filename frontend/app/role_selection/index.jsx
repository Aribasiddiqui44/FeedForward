import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import Head from '../../components/header';

export default function RoleSelection() {
  const navigation = useNavigation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handlePress = (selectedRole) => {
    if (!selectedRole) {
      Alert.alert("Please select a role.");
      return;
    }

    setLoading(true);
    try {
      // Navigate to the sign-up page, passing the selected role as a parameter
      router.push({
        pathname: '/auth/sign-up',
        params: { role: selectedRole },
      });
    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Head
        showBackOption={true}
        label="Feed Forward"
        onBackPress={() => router.back()}
      />
      <View style={styles.header}>
        <Text style={styles.subTitle}>Become a Feed Forward</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('donor')}>
        <Text style={styles.buttonText}>DONOR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('receiver')}>
        <Text style={styles.buttonText}>RECEIVER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('volunteer')}>
        <Text style={styles.buttonText}>VOLUNTEER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  header: {
    width: '100%',
    alignItems: 'center',
  },
  subTitle: {
    marginVertical: 30,
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    margin: '15%',
    width: '70%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
