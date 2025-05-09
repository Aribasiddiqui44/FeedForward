import { View, StyleSheet, ScrollView, TextInput, Text, TouchableOpacity,Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import FoodCard from '../../../components/foodCard';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function MyOrder() {
  const router = useRouter();

  // State for time filter input and filtered orders
  const [timeFilter, setTimeFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Hardcoded available orders (for now)
const orders = [
  {
    foodName: "Chicken Biryani",
    description: "Fresh biryani available from today’s lunch batch.",
    total: "400 PKR",
    portions: "10",
    statusTime: "1:00 pm",
    date: "06/05/2025",
    imageSource: require('../../../assets/images/biryaniPng.png'),
    orderFrom: 'Al Baik Restaurant',
    deliverTo: 'Saylani Welfare',
  },
  {
    foodName: "Veggie Pasta",
    description: "Leftover pasta with vegetables and cheese.",
    total: "300 PKR",
    portions: "5",
    statusTime: "3:30 pm",
    date: "06/05/2025",
    imageSource: require('../../../assets/images/yum.png'),
    orderFrom: 'Greens Café',
    deliverTo: 'JDC Foundation',
  },
  {
    foodName: "Chapli Kabab",
    description: "Spicy chapli kababs packed hygienically.",
    total: "600 PKR",
    portions: "12",
    statusTime: "5:45 pm",
    date: "06/05/2025",
    imageSource: require('../../../assets/images/kabab.jpg'), // Make sure this image exists
    orderFrom: 'Karahi Express',
    deliverTo: 'Edhi Homes',
  },
];

const [allOrders, setAllOrders] = useState(orders); // Set initial orders


  // Function to filter orders based on time input
  const handleFilterChange = (text) => {
    setTimeFilter(text);
    if (text) {
      // Filter orders that match the input time
      const filtered = allOrders.filter((order) =>
        order.statusTime.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      // If no filter text, show all orders
      setFilteredOrders(allOrders);
    }
  };

  const handleTrackPress = (foodDetails) => {
    router.push({
      pathname: '../../TrackOrder/TrackOrder',
      params: {
        foodName: foodDetails.foodName,
        statusTime: foodDetails.statusTime,
        imageSource: foodDetails.imageSource,
        portions: foodDetails.portions,
        total: foodDetails.total,
        date: foodDetails.date,
        orderFrom: foodDetails.orderFrom,
        deliverTo: foodDetails.deliverTo,
      },
    });
  };

  const handleConfirmDelivery = async (foodDetails) => {
    try {
      const existingData = await AsyncStorage.getItem('confirmedOrders');
      const confirmedOrders = existingData ? JSON.parse(existingData) : [];
  
      confirmedOrders.push(foodDetails);
  
      await AsyncStorage.setItem('confirmedOrders', JSON.stringify(confirmedOrders));
      console.log(`Delivery confirmed and saved: ${foodDetails.foodName}`);
  
      // Directly navigate to acceptedOrders
      router.push('/volunteer/acceptedOrders'); // Navigate to accepted orders after confirmation
  
    } catch (error) {
      console.error('Error saving confirmed order:', error);
      Alert.alert('Error', 'Something went wrong while confirming the order.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Available Orders</Text>
      {/* Filter Input */}
      <TextInput
        style={styles.filterInput}
        placeholder="Enter time (e.g. 11:00 pm)"
        value={timeFilter}
        onChangeText={handleFilterChange}
      />
      {/* Display all orders initially or filtered orders */}
      <ScrollView>
        {(filteredOrders.length > 0 ? filteredOrders : allOrders).map((order, index) => (
          <View key={index} style={styles.foodCardContainer}>
            <FoodCard
              foodName={order.foodName}
              description={order.description}
              total={order.total}
              portions={order.portions}
              statusTime={order.statusTime}
              date={order.date}
              imageSource={order.imageSource}
            />
            {/* Buttons Row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.trackButton}
                onPress={() =>
                  handleTrackPress({
                    foodName: order.foodName,
                    portions: order.portions,
                    statusTime: order.statusTime,
                    imageSource: order.imageSource,
                    date: order.date,
                    total: order.total,
                    orderFrom: order.orderFrom,
                    deliverTo: order.deliverTo,
                  })
                }
              >
                <Text style={styles.trackButtonText}>Track Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleConfirmDelivery(order)}
              >
                <Text style={styles.confirmButtonText}>Confirm Delivery</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {/* If no orders match the filter */}
        {filteredOrders.length === 0 && timeFilter && (
          <Text>No orders found for this time.</Text>
        )}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
  },
  filterInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00aa95',
    marginBottom: 10,
  },
  
  foodCardContainer: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  trackButton: {
    backgroundColor: '#00aa95',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30, // Adjust width as needed
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#00aa95',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30, // Adjust width as needed
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

//import { useEffect } from 'react';
//import axios from 'axios';

// Example: Replace hardcoded orders with API call
// useEffect(() => {
//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get('https://your-api-url.com/orders');
//       const fetchedOrders = response.data;
//       setAllOrders(fetchedOrders);
//     } catch (error) {
//       console.error('Failed to fetch orders:', error);
//     }
//   };

//   fetchOrders();
// }, []);