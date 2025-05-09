import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Colors } from '../../../constants/Colors'; // Make sure this is defined
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ImpactScreen = () => {
  const [acceptedOrders, setAcceptedOrders] = useState(10); // Dummy value
  const [deliveredOrders, setDeliveredOrders] = useState(5); // Dummy value
  const [availableOrders, setAvailableOrders] = useState(3); // Dummy value
  const [volunteerRating, setVolunteerRating] = useState(4.5); // Dummy value

  const navigation = useNavigation();

  const getToken = async () => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem('accessToken');
    } else {
      return await SecureStore.getItemAsync('accessToken');
    }
  };

  const fetchOrderStats = async () => {
    const token = await getToken();
    try {
      const response = await axios.get('http://localhost:8000/orders/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAcceptedOrders(response.data.accepted);
      setDeliveredOrders(response.data.delivered);
      setAvailableOrders(response.data.available);
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  };

  const fetchVolunteerRating = async () => {
    setVolunteerRating(4.8); // Replace with actual logic
  };

  const handleOrderStatusClick = (status) => {
    Alert.alert(`${status} Orders`, `You clicked on ${status} orders.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Impact Overview</Text>

      <TouchableOpacity
        style={styles.statusCard}
        onPress={() => handleOrderStatusClick('Accepted')}
      >
        <Text style={styles.statusText}>Accepted Orders</Text>
        <Text style={styles.count}>{acceptedOrders}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statusCard}
        onPress={() => handleOrderStatusClick('Delivered')}
      >
        <Text style={styles.statusText}>Delivered Orders</Text>
        <Text style={styles.count}>{deliveredOrders}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statusCard}
        onPress={() => handleOrderStatusClick('Available')}
      >
        <Text style={styles.statusText}>Available Orders</Text>
        <Text style={styles.count}>{availableOrders}</Text>
      </TouchableOpacity>

      <View style={styles.volunteerRatingContainer}>
        <Text style={styles.volunteerRatingText}>Volunteer Rating: {volunteerRating} ⭐</Text>
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => {
          fetchOrderStats();
          fetchVolunteerRating();
        }}
      >
        <Text style={styles.refreshButtonText}>Refresh Stats</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.LightGrey,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  statusCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statusText: {
    fontSize: 18,
    color: '#000', // black
    marginBottom: 8,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#20B2AA', // green color for numbers
  },
  volunteerRatingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  volunteerRatingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ImpactScreen;
