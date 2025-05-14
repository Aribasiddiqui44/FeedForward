import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';

const AvailableOrdersScreen = () => {
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const orders = [
    {
      id: 'ORD-12345',
      foodName: 'Chicken Biryani',
      foodPic: require('../../../assets/images/biryaniPng.png'),
      pickupTime: '11:00 PM',
      price: '350 PKR',
      type: 'free',
      orgId: 'ORG-789'
    },
    {
      id: 'ORD-67890',
      foodName: 'Burgers',
      foodPic: require('../../../assets/images/burger.jpeg'),
      pickupTime: '08:30 PM',
      price: '250 PKR',
      type: 'direct',
      orgId: 'ORG-456'
    },
    {
      id: 'ORD-13579',
      foodName: 'Pizza',
      foodPic: require('../../../assets/images/burger.jpeg'),
      pickupTime: '09:15 PM',
      price: '500 PKR',
      type: 'negotiated',
      orgId: 'ORG-123'
    }
  ];

  const navigateToOrderDetails = (order) => {
    navigation.navigate('OrderDetails', { order });
  };

  const getTypeStyle = (type) => {
    switch(type) {
      case 'free': return styles.freeType;
      case 'direct': return styles.directType;
      case 'negotiated': return styles.negotiatedType;
      default: return styles.freeType;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Available Orders</Text>
      
      {orders.map((order) => (
        <TouchableOpacity 
          key={order.id} 
          style={styles.orderCard}
          onPress={() => navigateToOrderDetails(order)}
        >
          <Image source={order.foodPic} style={styles.foodImage} />
          
          <View style={styles.orderInfo}>
            <View style={styles.titleContainer}>
              <Text style={styles.foodName}>{order.foodName}</Text>
              <Text style={[styles.type, getTypeStyle(order.type)]}>
                {order.type.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.orderId}>Order ID: {order.id}</Text>
            <Text style={styles.pickupTime}>Pickup by: {order.pickupTime}</Text>
            <Text style={styles.price}>{order.price}</Text>
          </View>
          
          <TouchableOpacity style={styles.chatButton}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  orderInfo: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  orderId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  pickupTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 5,
  },
  type: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  freeType: {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
  },
  directType: {
    backgroundColor: '#E3F2FD',
    color: '#2196F3',
  },
  negotiatedType: {
    backgroundColor: '#FFF3E0',
    color: '#FF9800',
  },
  chatButton: {
    padding: 8,
    marginLeft: 10,
  },
});

export default AvailableOrdersScreen;