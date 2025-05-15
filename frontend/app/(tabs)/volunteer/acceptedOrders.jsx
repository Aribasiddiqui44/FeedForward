import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';

const AcceptedOrders = () => {
  // In a real app, you would fetch these from your state management or API
  const acceptedOrders = [
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
      toDonor: '3km',
      status: 'accepted',
      acceptedAt: new Date().toISOString()
    },
    // Add more accepted orders as needed
  ];

  const handleCompleteOrder = (orderId) => {
    // Implement order completion logic
    console.log('Completing order:', orderId);
    // apiClient.patch(`/orders/${orderId}/complete`);
  };

  const handleCancelOrder = (orderId) => {
    // Implement order cancellation logic
    console.log('Canceling order:', orderId);
    // apiClient.patch(`/orders/${orderId}/cancel`);
  };

  return (
    <ScrollView style={styles.container}>
      {acceptedOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="fast-food" size={60} color={Colors.primary} />
          <Text style={styles.emptyText}>No accepted orders yet</Text>
          <Text style={styles.emptySubtext}>Accepted orders will appear here</Text>
        </View>
      ) : (
        acceptedOrders.map((order) => (
          <View key={order.id} style={styles.card}>
            <View style={styles.contentContainer}>
              <Image source={order.foodPic} style={styles.foodImage} />
              
              <View style={styles.orderInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.foodTitle}>{order.foodName}</Text>
                  <View style={[styles.statusBadge, styles.acceptedBadge]}>
                    <Text style={styles.statusText}>ACCEPTED</Text>
                  </View>
                </View>
                <Text style={styles.idText}>Order ID: {order.id.slice(-6).toUpperCase()}</Text>
                <Text style={styles.detailText}>Pickup by: {order.pickupTime}</Text>
                <Text style={styles.detailText}>Accepted at: {new Date(order.acceptedAt).toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Pickup Location</Text>
              <View style={styles.locationCard}>
                <Ionicons name="restaurant" size={20} color={Colors.primary} />
                <Text style={styles.locationText}>{order.donorName} - {order.donorAddress}</Text>
              </View>
            </View>

            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Delivery Location</Text>
              <View style={styles.locationCard}>
                <Ionicons name="location" size={20} color={Colors.primary} />
                <Text style={styles.locationText}>{order.receiverAddress}</Text>
              </View>
              <Text style={styles.distanceText}>{order.toReceiver} away (~17 mins)</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => handleCompleteOrder(order.id)}
              >
                <Text style={styles.buttonText}>Mark Completed</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleCancelOrder(order.id)}
              >
                <Text style={[styles.buttonText, { color: Colors.danger }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: Colors.dark,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.Grey,
    marginTop: 10,
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  acceptedBadge: {
    backgroundColor: Colors.primaryLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
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
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  locationSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 8,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: Colors.dark,
    marginLeft: 10,
    flex: 1,
  },
  distanceText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.danger,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
});

export default AcceptedOrders;