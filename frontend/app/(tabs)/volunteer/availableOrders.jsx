



import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView ,Alert} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import ChatButton from '../../../components/ChatButton';
import apiClient from '../../../utils/apiClient';

const AvailableOrdersScreen = () => {
  const router = useRouter();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/order/rider/available');
        setAvailableOrders(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    fetchOrders();
  }, []);

  // const handleConfirm = (orderId) => {
  //   const orderToAccept = availableOrders.find(order => order._id === orderId);
  //   if (orderToAccept) {
  //     setAcceptedOrders(prev => [...prev, orderToAccept]);
  //     setAvailableOrders(prev => prev.filter(order => order._id !== orderId));
  //     console.log('Order accepted:', orderId);
  //   }
  // };

  // const handleDecline = (orderId) => {
  //   setAvailableOrders(prev => prev.filter(order => order._id !== orderId));
  //   console.log('Order declined:', orderId);
  // };
const handleConfirm = async (orderId) => {
  const orderToAccept = availableOrders.find(order => order._id === orderId);
  if (!orderToAccept) return;

  try {
    const response = await apiClient.patch(`/order/${orderId}/rider-response`, {
      action: 'accept'
    });

    if (response.status === 200) {
      setAcceptedOrders(prev => [...prev, orderToAccept]);
      setAvailableOrders(prev => prev.filter(order => order._id !== orderId));
      console.log('Order accepted on backend:', orderId);
    }
  } catch (error) {
    console.error('Failed to accept order:', error);
    Alert.alert("Failed to accept", error.response?.data?.message || "Please try again");
  }
};

const handleDecline = async (orderId) => {
  try {
    const response = await apiClient.patch(`/order/${orderId}/rider-response`, {
      action: 'decline'
    });

    if (response.status === 200) {
      setAvailableOrders(prev => prev.filter(order => order._id !== orderId));
      console.log('Order declined on backend:', orderId);
    }
  } catch (error) {
    console.error('Failed to decline order:', error);
    Alert.alert("Failed to decline", error.response?.data?.message || "Please try again");
  }
};
  const navigateToOrderDetails = (order) => {
    router.push({
      pathname: '/(tabs)/volunteer/orderDetails/[id]',
      params: {
        id: order._id,
        estimatedTime: '10 mins'
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      {availableOrders.map((order) => (
        <View key={order._id} style={styles.card}>
          <TouchableOpacity 
            style={styles.contentContainer}
            onPress={() => navigateToOrderDetails(order)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: order.donation?.listingImages?.[0] }} style={styles.foodImage} />

            <View style={styles.orderInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.foodTitle}>{order.donation?.donationFoodTitle}</Text>
                {/* <Text style={[styles.type, styles.directType]}>
                  {order.paymentMethod?.replace(/_/g, ' ').toUpperCase()}
                </Text> */}
              </View>
              <Text style={styles.idText}>Order ID: {order._id}</Text>
              <Text style={styles.detailText}>Pickup by: {order.pickupDetails?.scheduledTime?.startingTime}</Text>
              <Text style={[styles.detailText, { color: Colors.primary }]}>Price: {order.orderTotal} PKR</Text>
            </View>

            <ChatButton receiverId={order.receiver?._id} />
          </TouchableOpacity>

          <View style={styles.divider} />
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => handleConfirm(order._id)}
            >
              <Text style={styles.confirmText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.outlinedButton, { borderColor: Colors.primary }]}
              onPress={() => handleDecline(order._id)}
            >
              <Text style={[styles.outlinedButtonText, { color: Colors.primary }]}>Decline</Text>
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
    color: Colors.White,
  },
  directType: {
    backgroundColor: Colors.primary,
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
