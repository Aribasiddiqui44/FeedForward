import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import ChatButton from '../../../components/ChatButton';

const AvailableOrdersScreen = () => {
  const navigation = useNavigation();

  const orders = [
    {
      id: 'ORD-12345',
      foodName: 'Chicken Biryani',
      foodPic: require('../../../assets/images/biryaniPng.png'),
      pickupTime: '11:00 PM',
      price: '0 PKR',
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
      price: '100 PKR',
      type: 'negotiated',
      orgId: 'ORG-123'
    }
  ];

  const handleConfirm = (orderId) => {
    console.log('Confirmed order:', orderId);
    // Add your confirmation logic here
  };

  const handleDelete = (orderId) => {
    console.log('Deleted order:', orderId);
    // Add your deletion logic here
  };

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
      {orders.map((order) => (
        <View key={order.id} style={styles.card}>
          <TouchableOpacity 
            style={styles.contentContainer}
            onPress={() => navigateToOrderDetails(order)}
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
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.outlinedButton, { borderColor: Colors.primary }]}
              onPress={() => handleDelete(order.id)}
            >
              <Text style={[styles.outlinedButtonText, { color: Colors.primary }]}>
                Delete
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