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
  
  // Extract order details from params
  const {
    receiverId = 'Zar123',
    foodName = 'Chicken Biryani',
    foodPic = require('../../../assets/images/biryaniPng.png'),
    pickupTime = '11:00 PM',
    price = '0 PKR',
    donorName = 'Hot N Spicy',
    donorAddress = 'North Nazimabad, Block L, Karachi',
    receiverName = 'Food Savers',
    receiverAddress = 'C-456, Block 18, F.B Area, Karachi',
    toReceiver = '2km',
    toDonor = '3km'
  } = params;

  const handleCompletePickup = () => {
    console.log('Pickup completed');
    // Implement pickup completion logic
    // router.push('/pickup-completed');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Go To Donor</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <View style={styles.foodContainer}>
        <Image source={foodPic} style={styles.foodImage} />
        <Text style={styles.foodName}>{foodName}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="pricetag" size={20} color={Colors.primary} />
          <Text style={styles.detailText}>Price: {price}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="fast-food" size={20} color={Colors.primary} />
          <Text style={styles.detailText}>Portion: 7</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time" size={20} color={Colors.primary} />
          <Text style={styles.detailText}>Pick up time: {pickupTime}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="car" size={20} color={Colors.primary} />
          <Text style={styles.detailText}>Distance To Donor: 17 mins</Text>
        </View>
      </View>
      
        


      <View style={styles.locationSection}>
        <Text style={styles.sectionTitle}>Pickup Location</Text>
        <View style={styles.locationCard}>
          <Ionicons name="restaurant" size={24} color={Colors.primary} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationName}>{donorName}</Text>
            <Text style={styles.locationAddress}>{donorAddress}</Text>
          </View>
        </View>
      </View>
        <View style={styles.locationCard}>
          <ChatButton receiverId={receiverId} />
          <Text style={styles.detailText}>Chat with Donor</Text>
        </View>
        <View style={styles.locationCard}>
          <CallButton number="03362168153" />
          <Text style={styles.detailText}>Call with Donor</Text>
        </View>

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
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  foodContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  detailText: {
    fontSize: 16,
    color: Colors.dark,
    marginLeft: 10,
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  ingredient: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    color: Colors.dark,
  },
  locationSection: {
    marginBottom: 20,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 15,
    marginTop: 8,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  locationAddress: {
    fontSize: 14,
    color: Colors.dark,
    marginTop: 5,
  },
  distanceText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 5,
    textAlign: 'right',
    paddingRight: 10,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: Colors.White,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GoToDonorScreen;