import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import FoodCard from '../../../components/foodCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/AntDesign';

export default function AcceptedOrders() {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const router = useRouter();

  const loadConfirmedOrders = async () => {
    try {
      const data = await AsyncStorage.getItem('confirmedOrders');
      if (data) {
        setConfirmedOrders(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading confirmed orders:', error);
      Alert.alert('Error', 'Failed to load confirmed orders');
    }
  };

  // Reload confirmed orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadConfirmedOrders();
    }, [])
  );

  const handleTrackPress = (order) => {
    router.push({
      pathname: '../../TrackOrder/VolunteerTrackOrder',
      params: {
        foodName: order.foodName,
        statusTime: order.statusTime,
        imageSource: order.imageSource,
        portions: order.portions,
        total: order.total,
        date: order.date,
        orderFrom: order.orderFrom,
        deliverTo: order.deliverTo,
        deliveryStatus: order.deliveryStatus,
      },
    });
  };

  const handleDeleteOrder = async (foodName) => {
    const updatedOrders = confirmedOrders.filter(order => order.foodName !== foodName);
    setConfirmedOrders(updatedOrders);
    try {
      await AsyncStorage.setItem('confirmedOrders', JSON.stringify(updatedOrders));
      Alert.alert('Success', 'Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      Alert.alert('Error', 'Failed to delete order');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Accepted Orders</Text>
      <ScrollView>
        {confirmedOrders.map((order, index) => (
          <View key={index} style={styles.foodCardContainer}>
            <FoodCard
              foodName={order.foodName}
              description={order.description}
              total={order.total}
              portions={order.portions}
              statusTime={order.statusTime}
              date={order.date}
              imageSource={order.imageSource}
            />
            <Text>{order.deliveryStatus}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.trackButton}
                onPress={() => handleTrackPress(order)}
              >
                <Text style={styles.trackButtonText}>Track Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteOrder(order.foodName)}
              >
                <Icon name="delete" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00aa95',
    marginVertical: 10,
  },
  foodCardContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  trackButton: {
    backgroundColor: '#00aa95',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    padding: 10,
  },
});
