import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import RestaurantCard from '../../../components/restaurantCard';
import { Colors } from '../../../constants/Colors';
import { useRouter } from 'expo-router';
import apiClient from '../../../utils/apiClient';

export default function RestaurantListing() {
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/donation/available');
      
      if (!response.data || !response.data.data || !response.data.data.donations) {
        throw new Error('Invalid data format received from server');
      }

      setDonations(response.data.data.donations);
    } catch (err) {
      setError(err.message || 'Failed to fetch donations');
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

// Update the transformDonationsToRestaurantData function in restaurantListing.jsx
const transformDonationsToRestaurantData = (donations) => {
  if (!Array.isArray(donations)) return [];
  
  const restaurantsMap = new Map();
  
  donations.forEach(donation => {
    const donor = donation.donatedBy || {};
    const restaurantId = donor._id || 'anonymous';
    
    if (!restaurantsMap.has(restaurantId)) {
      restaurantsMap.set(restaurantId, {
        id: restaurantId,
        name: donor.fullName || 'Anonymous Donor',
        phone: donor.phoneNumber || 'N/A',
        distance: 1,
        time: formatTimeRange(donation.donationInitialPickupTimeRange),
        foodItems: []
      });
    }
    
    const restaurant = restaurantsMap.get(restaurantId);
    const isFree = donation.listingType === "donation" || donation.donationUnitPrice?.value===0;
    const hasNegotiation = donation.donationUnitPrice?.minPricePerUnit > 0;
    
    restaurant.foodItems.push({
      id: donation._id,
      name: donation.donationFoodTitle || 'Unnamed Donation',
      quantity: donation.donationQuantity?.quantity || 1,
      price: isFree ? 'Free' : donation.donationUnitPrice?.value || 0,
      priceValue: donation.donationUnitPrice?.value || 0, 
      minPricePerUnit: donation.donationUnitPrice?.minPricePerUnit || 0,
      description: donation.donationDescription || 'No description provided',
      pickupInstructions: donation.donationPickupInstructions || [],
      pickupTimeRange: donation.donationInitialPickupTimeRange,
      expiryDate: donation.foodExpiry?.bestBefore || 'N/A',
      image: donation.listingImages?.[0] || require('../../../assets/images/greenLogo.png'),
      isFree,
      hasNegotiation,
      listingType: donation.listingType || 'donation'
    });
  });
  
  return Array.from(restaurantsMap.values());
};
  const formatTimeRange = (timeRange) => {
    if (!timeRange) return 'Flexible';
    return `${timeRange.startingTime || ''} - ${timeRange.endingTime || ''}`.trim() || 'Flexible';
  };
  const handleFoodItemPress = (foodItem, restaurant) => {  
    try {
      router.push({
        pathname: '/foodDetail/FoodDetails',
        params: {
          // Restaurant details
          restId: restaurant.id,
          rest_name: restaurant.name,
          rest_phone: restaurant.phone,
          //rest_time: restaurant.time,
          rest_dist: String(restaurant.distance),
          // Food item details
          foodId: foodItem.id,
          foodName: foodItem.name,
          foodPrice: foodItem.price,
          foodDescription: foodItem.description,
          foodQuantity: foodItem.quantity,
          foodImg: foodItem.image,
          minPricePerUnit: foodItem.minPricePerUnit || 0,
          listingType:foodItem.listingType,
          // Additional details
          pickupInstructions: foodItem.pickupInstructions?.join(', ') || 'None',
          pickupTimeRange: formatTimeRange(foodItem.pickupTimeRange),
          expiryDate: foodItem.expiryDate || 'Not specified'
        }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      //Alert.alert('Error', 'Could not open food details');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchDonations}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const restaurantData = transformDonationsToRestaurantData(donations);

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurantData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onFoodItemPress={(foodItem) => handleFoodItemPress(foodItem, item)}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.row}>
            <View style={styles.line} />
            <Text style={styles.text}>Offers in the Current Map Area</Text>
            <View style={styles.line} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No donations available at the moment</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.Grey,
  },
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  line: {
    height: 1,
    backgroundColor: Colors.Grey,
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 10,
  },
});