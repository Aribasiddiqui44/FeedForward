import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import RestaurantCard from '../../../components/restaurantCard';
import { Colors } from '../../../constants/Colors';
import { useRouter } from 'expo-router';
import apiClient from '../../../utils/apiClient';
import { useLocalSearchParams } from 'expo-router';
import { Modal,TextInput } from 'react-native';
export default function RestaurantListing() {
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 999 });
  const [mealsCountFilter, setMealsCountFilter] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(null);
  const [activeSort, setActiveSort] = useState('Best Match');
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Best Match');
  const params = useLocalSearchParams();

  useEffect(() => {
  const searchEnabled = params?.showSearch === 'true';
  setSearchVisible(searchEnabled);

  if (!searchEnabled) {
    // Reset filters only when hiding the search
    setPriceFilter({ min: 0, max: 999 });
    setMealsCountFilter(null);
    setDistanceFilter(null);
    setActiveSort('Best Match');
    setSelectedFilter('Best Match');
    setSearchVisible==='false';
  }
}, [params?.showSearch]);

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

useEffect(() => {
  
  const filtered = donations.filter((donation) => {
    const price = donation.donationUnitPrice?.value || 0;
    const quantity = donation.donationQuantity?.quantity || 0;
    const withinPrice = price >= priceFilter.min && price <= priceFilter.max;
    const matchesMeals = !mealsCountFilter || quantity >= mealsCountFilter;
    const withinDistance = !distanceFilter || 1 <= distanceFilter; // Replace 1 with actual distance logic if added
    return withinPrice && matchesMeals && withinDistance;
  });

  // Optional sorting
  if (activeSort === 'Price') {
    filtered.sort((a, b) => (a.donationUnitPrice?.value || 0) - (b.donationUnitPrice?.value || 0));
  } else if (activeSort === 'Meals Count') {
    filtered.sort((a, b) => (b.donationQuantity?.quantity || 0) - (a.donationQuantity?.quantity || 0));
  }

  setFilteredDonations(filtered);
}, [priceFilter, mealsCountFilter, distanceFilter, activeSort, donations]);

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

  //const restaurantData = transformDonationsToRestaurantData(donations);
  const restaurantData = transformDonationsToRestaurantData(filteredDonations.length ? filteredDonations : donations);


  return (
    <View style={styles.container}>
        {/* {searchVisible && (
  <View>
    <View style={styles.filterRow}>
      {['Best Match', 'Price', 'Meals Count', 'Distance'].map((filter) => (
        <TouchableOpacity
          key={filter}
          onPress={() => setSelectedFilter(filter)}
          style={[
            styles.filterPill,
            selectedFilter === filter && styles.activePill
          ]}
        >
          <Text
            style={{
              color: selectedFilter === filter ? '#fff' : '#555',
              fontWeight: '500'
            }}
          >
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {selectedFilter === 'Price' && (
      <View style={styles.filterInputRow}>
        <TextInput
          placeholder="Min"
          style={styles.filterInput}
          keyboardType="numeric"
          onChangeText={(text) =>
            setPriceFilter((prev) => ({ ...prev, min: parseInt(text) || 0 }))
          }
        />
        <Text style={{ marginHorizontal: 5 }}>-</Text>
        <TextInput
          placeholder="Max"
          style={styles.filterInput}
          keyboardType="numeric"
          onChangeText={(text) =>
            setPriceFilter((prev) => ({ ...prev, max: parseInt(text) || 999 }))
          }
        />
      </View>
    )}

    {selectedFilter === 'Meals Count' && (
      <View style={styles.filterInputRow}>
        <TextInput
          placeholder="Min Meals"
          style={styles.filterInput}
          keyboardType="numeric"
          onChangeText={(text) => setMealsCountFilter(parseInt(text) || null)}
        />
      </View>
    )}

    {selectedFilter === 'Distance' && (
      <View style={styles.filterInputRow}>
        <TextInput
          placeholder="Max Distance"
          style={styles.filterInput}
          keyboardType="numeric"
          onChangeText={(text) => setDistanceFilter(parseInt(text) || null)}
        />
      </View>
    )}

    <TouchableOpacity
      onPress={() => {
        setPriceFilter({ min: 0, max: 999 });
        setMealsCountFilter(null);
        setDistanceFilter(null);
        setActiveSort('Best Match');
        setSelectedFilter('Best Match');
      }}
      style={[styles.applyButton, { backgroundColor: '#ccc', marginBottom: 10 }]}
    >
      <Text style={{ color: '#000' }}>Reset Filters</Text>
    </TouchableOpacity>
  </View>
)} */}
{searchVisible && (
        <View style={styles.filterContainer}>
          {/* Filter options UI */}
          <View style={styles.filterRow}>
            {['Best Match', 'Price', 'Meals Count', 'Distance'].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterPill,
                  selectedFilter === filter && styles.activePill
                ]}
              >
                <Text style={{
                  color: selectedFilter === filter ? '#fff' : '#555',
                  fontWeight: '500'
                }}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Filter Input */}
          {selectedFilter === 'Price' && (
            <View style={styles.filterInputRow}>
              <TextInput
                placeholder="Min"
                style={styles.filterInput}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPriceFilter((prev) => ({ ...prev, min: parseInt(text) || 0 }))
                }
              />
              <Text style={{ marginHorizontal: 5 }}>-</Text>
              <TextInput
                placeholder="Max"
                style={styles.filterInput}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPriceFilter((prev) => ({ ...prev, max: parseInt(text) || 999 }))
                }
              />
            </View>
          )}

          {/* Meals Count Filter Input */}
          {selectedFilter === 'Meals Count' && (
            <View style={styles.filterInputRow}>
              <TextInput
                placeholder="Min Meals"
                style={styles.filterInput}
                keyboardType="numeric"
                onChangeText={(text) => setMealsCountFilter(parseInt(text) || null)}
              />
            </View>
          )}

          {/* Distance Filter Input */}
          {selectedFilter === 'Distance' && (
            <View style={styles.filterInputRow}>
              <TextInput
                placeholder="Max Distance"
                style={styles.filterInput}
                keyboardType="numeric"
                onChangeText={(text) => setDistanceFilter(parseInt(text) || null)}
              />
            </View>
          )}

          {/* Reset Filters Button */}
          <TouchableOpacity
            onPress={() => {
              setPriceFilter({ min: 0, max: 999 });
              setMealsCountFilter(null);
              setDistanceFilter(null);
              setActiveSort('Best Match');
              setSelectedFilter('Best Match');
            }}
            style={[styles.applyButton, { backgroundColor: '#ccc', marginBottom: 10 }]}
          >
            <Text style={{ color: '#000' }}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}
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
      {/* Filter Buttons Row */}
    

    </View>
    
  );

}

const styles = StyleSheet.create({
  filterContainer: {
  backgroundColor: '#fff',
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
  elevation: 2,
},
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
  filterModal: {
  backgroundColor: 'white',
  margin: 20,
  padding: 20,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 5,
  alignItems: 'center',
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 10,
  width: '100%',
  marginVertical: 8,
},
applyButton: {
  backgroundColor: Colors.primary,
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
},
filterLabel: {
  fontWeight: '600',
  alignSelf: 'flex-start',
  marginTop: 10,
  marginBottom: 4,
},

sortRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 8,
  width: '100%',
},

sortButton: {
  padding: 8,
  borderRadius: 5,
  backgroundColor: '#eee',
  flex: 1,
  marginHorizontal: 3,
  alignItems: 'center',
},

sortButtonText: {
  color: '#333',
},

sortButtonActiveText: {
  color: Colors.primary,
  fontWeight: 'bold',
},
filterRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingHorizontal: 10,
  marginVertical: 10,
},

filterPill: {
  backgroundColor: '#eee',
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 20,
  marginHorizontal: 5,
},

activePill: {
  backgroundColor: Colors.primary,
},

filterInputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 10,
},

filterInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 8,
  width: 80,
  backgroundColor: '#fff',
},


});