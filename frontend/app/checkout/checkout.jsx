import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import React, { useState,useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from '../../components/header';
import { Colors } from '../../constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView } from 'react-native';
import apiClient from '../../utils/apiClient';
import { useNavigation } from 'expo-router';
export default function Checkout() {
  const searchParams = useLocalSearchParams();
  const { 
    foodName, 
    foodPrice, 
    pickupTimeRange, 
    selectedQuantity,
    rest_name,
    foodImg,
    foodId,
    minPricePerUnit = 0
  } = searchParams;
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handlePaymentMethod = async (paymentMethod) => {
    if (!selectedQuantity || selectedQuantity <= 0) {
      Alert.alert('Error', 'Please select at least one portion');
      return;
    }
  
    setIsLoading(true);
    
    try {
      const response = await apiClient.post(
        `/request/donations/${foodId}/direct-checkout`,
        {
          quantity: Number(selectedQuantity),
          paymentMethod,
          pickupTimeRange: typeof pickupTimeRange === 'string' 
            ? { startingTime: pickupTimeRange.split(' - ')[0], endingTime: pickupTimeRange.split(' - ')[1] }
            : pickupTimeRange
        }
      );
  
      // Debug logs to verify response structure
      console.log('Full API response:', response);
      console.log('Response data:', response.data);
      console.log('Nested data:', response.data?.data);
  
      // Validate response structure
      if (!response.data?.data?.order?._id || !response.data?.data?.request?._id) {
        console.error('Missing IDs in response:', {
          orderId: response.data?.data?.order?._id,
          requestId: response.data?.data?.request?._id
        });
        throw new Error('Order or Request ID missing in server response');
      }
  
      const { order, request } = response.data.data;
      
      console.log('Navigating with order ID:', order._id); // Verify order ID exists
      
      router.replace({
        pathname: '/orderReceipt/OrderSuccess',
        params: {
          orderId: order._id.toString(), // Ensure it's a string
          requestId: request._id.toString(),
          foodName,
          totalPrice: order.orderTotal,
          quantity: selectedQuantity,
          rest_name,
          paymentMethod,
          status: 'processing',
          pickupTimeRange: JSON.stringify(pickupTimeRange) // Stringify if it's an object
        }
      });
  
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert(
        'Error', 
        error.message || 'Checkout failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  // const handlePaymentMethod = async (paymentMethod) => {
  //   if (!selectedQuantity || selectedQuantity <= 0) {
  //     Alert.alert('Error', 'Please select at least one portion');
  //     return;
  //   }

  //   setIsLoading(true);
    
  //   try {
  //     // Call the direct checkout endpoint
  //     const response = await apiClient.post(
  //       `/request/donations/${foodId}/direct-checkout`,
  //       {
  //         quantity: Number(selectedQuantity),
  //         paymentMethod,
  //         pickupTimeRange: pickupTimeRange
  //       }
  //     );

  //     if (response.status === 201) {
  //       const { order, request } = response.data;
        
  //       router.replace({
  //         pathname: '/orderReceipt/OrderSuccess',
  //         params: {
  //           orderId: order._id,
  //           requestId: request._id,
  //           foodName,
  //           totalPrice: order.orderTotal,
  //           quantity: selectedQuantity,
  //           rest_name,
  //           paymentMethod,
  //           status: 'processing'
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Checkout error:', error);
  //     Alert.alert(
  //       'Error', 
  //       error.response?.data?.message || 'Checkout failed. Please try again.'
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
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
          label='Check Out'
          onBackPress={handleBackPress}
      />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.foodItem}>
            <Image 
              source={typeof foodImg === 'string' ? { uri: foodImg } : foodImg} 
              style={styles.foodImage}
            />
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{foodName}</Text>
              <Text style={styles.foodPrice}>{foodPrice} PKR per portion</Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Restaurant:</Text>
            <Text style={styles.summaryValue}>{rest_name}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Quantity:</Text>
            <Text style={styles.summaryValue}>{selectedQuantity}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pickup Time:</Text>
            <Text style={styles.summaryValue}>{pickupTimeRange || 'Flexible'}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{foodPrice * selectedQuantity} PKR</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity 
            style={styles.paymentOption}
            onPress={() => handlePaymentMethod('card')}
            disabled={isLoading}
          >
            <View style={styles.paymentIcon}>
              <Ionicons name="card-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.paymentText}>Credit/Debit Card</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color={Colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.paymentOption}
            onPress={() => handlePaymentMethod('bank_transfer')}
            disabled={isLoading}
          >
            <View style={styles.paymentIcon}>
              <Ionicons name="cash-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.paymentText}>Bank Transfer</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color={Colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.paymentOption}
            onPress={() => handlePaymentMethod('cash_on_pickup')}
            disabled={isLoading}
          >
            <View style={styles.paymentIcon}>
              <Ionicons name="wallet-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.paymentText}>Cash on Pickup</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color={Colors.gray} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    margin: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 16,
  },
  foodItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  foodInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 14,
    color: Colors.gray,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.gray,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.dark,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  paymentIcon: {
    width: 40,
    alignItems: 'center',
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
    marginLeft: 8,
  },
});