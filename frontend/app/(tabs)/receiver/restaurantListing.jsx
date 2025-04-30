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

  const transformDonationsToRestaurantData = (donations) => {
    if (!Array.isArray(donations)) return [];
    
    // Create a map to group donations by restaurant
    const restaurantsMap = new Map();
    
    donations.forEach(donation => {
      const donor = donation.donatedBy || {};
      const restaurantId = donor._id || 'anonymous'; // Use donor ID as restaurant ID
      
      if (!restaurantsMap.has(restaurantId)) {
        // Create new restaurant entry if it doesn't exist
        restaurantsMap.set(restaurantId, {
          id: restaurantId,
          name: donor.fullName || 'Anonymous Donor',
          phone: donor.phoneNumber || 'N/A',
          distance: 1, // Default distance
          time: 'N/A', // Will be updated with the earliest ending time
          foodItems: []
        });
      }
      
      const restaurant = restaurantsMap.get(restaurantId);
      const quantity = donation.donationQuantity || {};
      const price = donation.donationUnitPrice || {};
      const timeRange = donation.donationInitialPickupTimeRange || {};
      
      // Add this donation as a food item
      restaurant.foodItems.push({
        id: donation._id,
        name: donation.donationFoodTitle || 'Unnamed Donation',
        quantity: quantity.quantity || 1,
        price: price.value || 0,
        description: donation.donationDescription || 'No description provided',
        pickupInstructions: donation.donationPickupInstructions || [],
        pickupTimeRange: timeRange,
        expiryDate: donation.foodExpiry?.bestBefore || 'N/A',
        image: donation.listingImages?.[0] || require('../../../assets/images/greenLogo.png')
      });
      
      // Update restaurant's time to show the earliest ending time
      if (timeRange.endingTime) {
        if (restaurant.time === 'N/A' || timeRange.endingTime < restaurant.time) {
          restaurant.time = timeRange.endingTime;
        }
      }
    });
    
    // Convert the map to an array of restaurants
    return Array.from(restaurantsMap.values());
  };

  const handleFoodItemPress = (foodItem, restaurant) => {
    console.log('Navigating with:', { // Debug log
      foodItem,
      restaurant
    });
  
    try {
      router.push({
        pathname: '/foodDetail/FoodDetails',
        params: {
          // Restaurant details
          restId: restaurant.id,
          rest_name: restaurant.name,
          rest_phone: restaurant.phone,
          rest_time: restaurant.time,
          rest_dist: String(restaurant.distance),
          // Food item details
          foodId: foodItem.id,
          foodName: foodItem.name,
          foodPrice: foodItem.price,
          foodDescription: foodItem.description,
          foodQuantity: foodItem.quantity,
          foodImg: foodItem.image,
          
          // Additional details
          pickupInstructions: foodItem.pickupInstructions?.join(', ') || 'None',
          pickupTimeRange: `${foodItem.pickupTimeRange?.startingTime || ''} - ${foodItem.pickupTimeRange?.endingTime || ''}`.trim(),
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