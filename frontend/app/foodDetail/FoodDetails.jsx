import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import FreeMealRequest from '../reciever/recieverDonation/FreeMealRequest';
import Head from '../../components/header';
export default function FoodDetails() {
  const router=useRouter();
  const searchParams = useLocalSearchParams();
  const {
    restId,
          rest_name,
          rest_phone,
          //rest_time,
          rest_dist,
          // Food item details
          foodId,
          foodName,
          foodPrice,
          foodDescription,
          foodQuantity,
          foodImg,
          minPricePerUnit,
          // Additional details
          pickupInstructions,
          pickupTimeRange,
          expiryDate } = searchParams;

  // State to manage the selected quantity
  const [selectedQuantity, setSelectedQuantity] = useState(0);

  // Increment function
  const incrementQuantity = () => {
    // Prevent exceeding the available quantity
    if (selectedQuantity < foodQuantity) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  // Decrement function
  const decrementQuantity = () => {
    // Prevent quantity from going below 0
    if (selectedQuantity > 0) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  if (
    !foodName ||
    !foodPrice ||
    !foodDescription ||
    !foodQuantity ||
    !restId ||
    !foodImg ||
    //!rest_time ||
    !rest_dist ||
    !rest_name
  ) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const handleBackPress = () => {
    router.back(); // Navigate back
  };
  const navigation= useNavigation();
  useEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      }, []);
  return (
    <View style={styles.container}>
      <Head 
              showBackOption={true}
              label='Feed Forward'
              onBackPress={handleBackPress}
            />
      {/* Food Image */}
      <Image source={foodImg} style={styles.image} />

      {/* Food Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.description}>
          <Text style={styles.foodName}>{foodName}</Text>
          <View style={styles.PriceContainer}>
            <Text style={styles.foodPrice}>{foodPrice} PKR</Text>
          </View>
        </View>

        <Text style={styles.foodDescription}>{foodDescription}</Text>

        {/* Timing and Restaurant Info */}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color="#888" style={styles.icon} />
          <Text style={styles.infoText}>Order Time: {pickupTimeRange}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#888" style={styles.icon} />
          <Text style={styles.infoText}>Pickup Time: {pickupTimeRange}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color="#888" style={styles.icon} />
          <Text style={styles.infoText}>{rest_name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="happy-outline" size={18} color="#888" style={styles.icon} />
          <Text style={styles.infoText}>90% good</Text>
        </View>

        {/* Portion Info */}
        <View style={styles.portionContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="restaurant-outline" size={18} color="#888" style={styles.icon} />
            <Text style={styles.infoText}>{foodQuantity} Portions Left</Text>
            
          </View>
          <View style={styles.counter}>
            {/* Decrement Button */}
            <TouchableOpacity style={styles.counterButton} onPress={decrementQuantity}>
              <Ionicons name="remove-outline" size={20} color="#000" />
            </TouchableOpacity>
            {/* Quantity Display */}
            <Text style={styles.counterValue}>{selectedQuantity}</Text>
            {/* Increment Button */}
            <TouchableOpacity style={styles.counterButton} onPress={incrementQuantity}>
              <Ionicons name="add-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Checkout Section */}
        <View style={styles.request}>
        <TouchableOpacity style={styles.checkoutButton} onPress={()=>router.push({
          pathname:'./../reciever/recieverDonation/FreeMealRequest',
          params:{
            foodName,
            foodId,
            foodPrice,
            foodDescription,
            foodQuantity,
            minPricePerUnit,
            restId,
            foodImg,
            rest_name,
            //rest_time,
            pickupTimeRange,
            rest_dist,
            selectedQuantity,
            actionType: 'free',
          }
        })}>
          <Text style={styles.requestText}>Request for free meals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkoutButton} onPress={()=>router.push({
          pathname:'./../reciever/recieverDonation/FreeMealRequest',
          params:{
            foodName,
            foodId,
            foodPrice,
            foodDescription,
            foodQuantity,
            restId,
            foodImg,
            minPricePerUnit,
            rest_name,
            //rest_time,
            pickupTimeRange,
            rest_dist,
            selectedQuantity,
            actionType: 'negotiate',

          }
        })}>
          <Text style={styles.requestText}>Request To Negotiate</Text>
        </TouchableOpacity>
        </View>


        <TouchableOpacity style={styles.checkoutButton}onPress={() =>
            router.push({
              pathname: '/checkout/checkout',
              params: {
                foodName,
                foodPrice,
                pickupTimeRange,
                selectedQuantity,
                rest_name,
                foodImg,
                foodId
              },
            })
          }>
          <Text style={styles.checkoutText}>Checkout</Text>
          <Text style={styles.checkoutText}>Total: {selectedQuantity * foodPrice} PKR</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  description: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsContainer: {
    padding: 16,
  },
  foodName: {
    fontSize: 19,
    fontWeight: 'semi-bold',
    marginBottom: 5,
    color: '#333',
  },
  foodPrice: {
    fontSize: 13,
    padding: 9,
    borderRadius: 15,
    width: 70,
    fontWeight: '600',
    color: Colors.White,
    backgroundColor: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
    alignSelf: 'center',
  },
  foodDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#777',
  },
  portionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  portionsLeft: {
    fontSize: 14,
    fontWeight: 'semi-bold',
    color: Colors.primary,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  counterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#eee',
  },
  counterValue: {
    paddingHorizontal: 10,
    fontSize: 16,
  },
  request:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginVertical:9,
    height:'14%',
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  checkoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight:500
  },
  requestButton: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent:'center'
  },
  requestText: {
    color: '#fff',
    fontSize: 14,
    fontWeight:500
  },
});