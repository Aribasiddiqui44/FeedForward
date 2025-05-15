import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import ChatButton from '../../../components/ChatButton';

const AvailableOrdersScreen = () => {
  const router = useRouter();
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: 'ORD-12345',
      foodName: 'Chicken Biryani',
      foodPic: require('../../../assets/images/biryaniPng.png'),
      pickupTime: '11:00 PM',
      price: '0 PKR',
      type: 'Free',
      orgId: 'ORG-789',
      donorName: 'Hot N Spicy',
      donorAddress: 'North Nazimabad, Block L, Karachi',
      receiverName: 'Food Savers',
      receiverAddress: 'C-456, Block 18, F.B Area, Karachi',
      toReceiver: '2km',
      toDonor: '3km'
    },
    {
      id: 'ORD-67890',
      foodName: 'Burgers',
      foodPic: require('../../../assets/images/burger.jpeg'), 
      pickupTime: '08:30 PM',
      price: '250 PKR',
      type: 'Direct',
      orgId: 'ORG-456',
      donorName: 'Burger King',
      donorAddress: 'Gulshan-e-Iqbal, Karachi',
      receiverName:'Rizq Foundation',
      receiverAddress: 'D-789, Block 5, Clifton, Karachi',
      toReceiver: '2km',
      toDonor: '3km'
    },
    {
      id: 'ORD-13579',
      foodName: 'Pizza',
      foodPic: require('../../../assets/images/burger.jpeg'),
      pickupTime: '09:15 PM',
      price: '100 PKR',
      type: 'Negotiated',
      orgId: 'ORG-123',
      donorName:'Lal Qila',
      pickupLocation: 'Tariq Road, Karachi',
      receiverName: 'Alfalah',
      receiverAddress: 'A-123, Block 10, Gulistan-e-Johar, Karachi',
      toReceiver: '2km',
      toDonor: '3km'
    }
  ]);

  const [acceptedOrders, setAcceptedOrders] = useState([]);

  const handleConfirm = (orderId) => {
    // Find the order to accept
    const orderToAccept = availableOrders.find(order => order.id === orderId);
    
    if (orderToAccept) {
      // Add to accepted orders
      setAcceptedOrders(prev => [...prev, orderToAccept]);
      
      // Remove from available orders
      setAvailableOrders(prev => prev.filter(order => order.id !== orderId));
      
      // Here you would typically also make an API call to update the order status
      console.log('Order accepted:', orderId);
      // apiClient.patch(`/orders/${orderId}/accept`, { status: 'accepted' });
    }
  };

  const handleDecline = (orderId) => {
    // Remove the order from available orders
    setAvailableOrders(prev => prev.filter(order => order.id !== orderId));
    
    // Here you would typically also make an API call to update the order status
    console.log('Order declined:', orderId);
    // apiClient.patch(`/orders/${orderId}/decline`, { status: 'declined' });
  };

  const navigateToOrderDetails = (order) => {
    router.push({
      pathname: '/(tabs)/volunteer/orderDetails/[id]',
      params: {
        id: order.id,
        ...order,
        estimatedTime: '10 mins'
      }
    });
  };
  
  const getTypeStyle = (type) => {
    switch(type) {
      case 'Free': return styles.freeType;
      case 'Direct': return styles.directType;
      case 'Negotiated': return styles.negotiatedType;
      default: return styles.freeType;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {availableOrders.map((order) => (
        <View key={order.id} style={styles.card}>
          <TouchableOpacity 
            style={styles.contentContainer}
            onPress={() => navigateToOrderDetails(order)}
            activeOpacity={0.7}
          >
            <Image source={order.foodPic} style={styles.foodImage} />
            
            <View style={styles.orderInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.foodTitle}>{order.foodName}</Text>
                <Text style={[styles.type, getTypeStyle(order.type)]}>
                  {order.type.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.idText}>Order ID: {order.id.slice(-6).toUpperCase()}</Text>
              <Text style={styles.detailText}>Pickup by: {order.pickupTime}</Text>
              <Text style={[styles.detailText, { color: Colors.primary }]}>
                Price: {order.price}
              </Text>
            </View>
            <ChatButton receiverId={order.orgId} />
          </TouchableOpacity>

          <View style={styles.divider} />
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => handleConfirm(order.id)}
            >
              <Text style={styles.confirmText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.outlinedButton, { borderColor: Colors.primary }]}
              onPress={() => handleDecline(order.id)}
            >
              <Text style={[styles.outlinedButtonText, { color: Colors.primary }]}>
                Decline
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 15,
  },
  orderInfo: {
    flex: 1,
  },
  titleRow: {
    width: '110%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  idText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
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
    backgroundColor: '#c20b00',
    color: Colors.White,
  },
  directType: {
    backgroundColor: Colors.primary,
    color: Colors.White,
  },
  negotiatedType: {
    backgroundColor: '#008000',
    color: Colors.White,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 5,
    alignItems: 'center',
  },
  outlinedButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    marginLeft: 5,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  outlinedButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AvailableOrdersScreen;