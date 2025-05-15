import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import ChatButton from '../../../components/ChatButton';
import CallButton from '../../../components/CallButton';

const GoToDonorScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract all order details with fallback values
  const order = {
    id: params.orderId || 'N/A',
    foodName: params.foodName || 'No food name specified',
    foodPic: params.foodPic || 'default',
    pickupTime: params.pickupTime || 'Not specified',
    price: params.price || '0 PKR',
    type: params.type || 'Unknown',
    donorName: params.donorName || 'Unknown donor',
    donorAddress: params.donorAddress || 'Address not available',
    receiverName: params.receiverName || 'Unknown receiver',
    receiverAddress: params.receiverAddress || 'Address not available',
    toDonor: params.toDonor || '? km',
    orgId: params.orgId || 'N/A'
  };

  const handleCompletePickup = () => {
    console.log('Pickup completed for order:', order.id);
    // Add your pickup completion logic here
    // router.push('/pickup-completed');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Food image and name */}
      <View style={styles.foodContainer}>
        <Image source={order.foodPic} style={styles.foodImage} />
        <Text style={styles.foodName}>{order.foodName}</Text>
        <Text style={styles.orderId}>Order ID: {order.id}</Text>
      </View>

      {/* Order details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="pricetag" size={20} color={Colors.primary} />
          <Text style={styles.detailText}>Price: {order.price}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time" size={20} color={Colors.primary} />
          <Text style={styles.detailText}>Pickup by: {order.pickupTime}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="car" size={20} color={Colors.primary} />
          <Text style={styles.detailText}>Distance: {order.toDonor} away</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="business" size={20} color={Colors.primary} />
          <Text style={styles.detailText}>Type: {order.type}</Text>
        </View>
      </View>

      {/* Donor information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Donor Information</Text>
        <View style={styles.infoCard}>
          <Ionicons name="restaurant" size={24} color={Colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>{order.donorName}</Text>
            <Text style={styles.infoSubtitle}>{order.donorAddress}</Text>
          </View>
        </View>
      </View>

    
      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionRow}>
          <ChatButton receiverId={order.orgId} />
          <Text style={styles.actionText}>Chat with Donor</Text>
        </View>
        
        <View style={styles.actionRow}>
          <CallButton number="03362168153" />
          <Text style={styles.actionText}>Call Donor</Text>
        </View>
      </View>

      {/* Complete pickup button */}
      <TouchableOpacity 
        style={styles.completeButton}
        onPress={handleCompletePickup}
      >
        <Text style={styles.completeButtonText}>Complete Pickup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  foodContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  foodImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 12,
  },
  foodName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    color: Colors.Grey,
  },
  detailsContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: Colors.dark,
    marginLeft: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 12,
    paddingLeft: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  infoSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionRow: {
    alignItems: 'center',
    width: '48%',
  },
  actionText: {
    fontSize: 14,
    color: Colors.dark,
    marginTop: 8,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  completeButtonText: {
    color: Colors.White,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GoToDonorScreen;