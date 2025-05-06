import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert,
  ScrollView 
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import Head from '../../../components/header';
import apiClient from '../../../utils/apiClient';

export default function FreeMealRequest() {
  const searchParams = useLocalSearchParams();
  const { 
    foodName = '', 
    foodPrice = 0, 
    pickupTimeRange = 'N/A',
    foodImg = null,
    selectedQuantity = 1, 
    actionType = '',
    foodId = '',
    minPricePerUnit = 0 
  } = searchParams; 
  
  const navigation = useNavigation();
  const router = useRouter();
  
  const [negotiatedPrice, setNegotiatedPrice] = useState(
    actionType === 'negotiation' ? Number(foodPrice) * Number(selectedQuantity) : 0
  );
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSliderChange = (value) => {
    const minTotal = Number(minPricePerUnit) * Number(selectedQuantity);
    setNegotiatedPrice(value);
    
    if (value < minTotal) {
      setPriceError(`Price cannot be below ${minTotal.toFixed(2)} PKR`);
    } else {
      setPriceError('');
    }
  };

  const handleRequestSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for your request');
      return;
    }
  
    // Validate negotiate request
    if (actionType === 'negotiation') {
      const minTotal = Number(minPricePerUnit) * Number(selectedQuantity);
      if (negotiatedPrice < minTotal) {
        Alert.alert(
          'Invalid Price',
          `The minimum acceptable price is ${minTotal.toFixed(2)} PKR`
        );
        return;
      }
    }
  
    setIsLoading(true);
    
    try {
      // Base payload for all request types
      const payload = {
        requestType: actionType, 
        foodId,
        quantity: Number(selectedQuantity),
        message: reason,
        status: 'pending', // Initial status
        createdAt: new Date().toISOString()
      };
  
      // Add type-specific fields
      if (actionType === 'negotiation') {
        payload.proposedPrice = Number(negotiatedPrice);
        payload.originalPrice = Number(foodPrice) * Number(selectedQuantity);
      } else if (actionType === 'checkout') {
        payload.totalAmount = Number(foodPrice) * Number(selectedQuantity);
      }
  
      const response = await apiClient.post(
        `/request/donations/${foodId}/requests`,
        payload,
      );
  
      if (response.status === 201) {
        // Show success message and navigate
        // Alert.alert(
        //   'Success', 
        //   `Your ${actionType} request has been submitted successfully`,
        //   [
        //     { 
        //       text: 'OK', 
        //       onPress: () => 
        router.push('/(tabs)/receiver/restaurantListing') 
        //     }
        //   ]
        // );
      }
    } catch (error) {
      console.error('Request error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to submit request'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <Head
        showBackOption={true}
        label="Checkout"
        onBackPress={handleBackPress}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.foodDetails}>
          {foodImg && (
            <Image 
              source={typeof foodImg === 'string' ? { uri: foodImg } : foodImg} 
              style={styles.image} 
              resizeMode="cover"
            />
          )}
          <Text style={styles.foodName}>{foodName}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.detailRow}>
            <View style={styles.infoRow}>
              <Ionicons name="restaurant-outline" size={18} color="#000" />
              <Text style={styles.infoText}>{selectedQuantity} portion{selectedQuantity !== 1 ? 's' : ''}</Text>
            </View>
            <Text style={styles.foodPrice}>
              {actionType === 'negotiation' ? negotiatedPrice.toFixed(2) : '0.00'} PKR
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color="#000" />
              <Text style={styles.infoText}>Pickup Time:</Text>
            </View>
            <Text style={styles.foodPrice}>{pickupTimeRange}</Text>
          </View>

          {actionType === 'negotiation' && (
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Set Your Price:</Text>
              <Slider
                style={styles.slider}
                minimumValue={Number(minPricePerUnit) * Number(selectedQuantity)}
                maximumValue={Number(foodPrice) * Number(selectedQuantity)}
                step={1}
                value={negotiatedPrice}
                onValueChange={handleSliderChange}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor="#ddd"
              />
              <View style={styles.priceInfoContainer}>
                <Text style={styles.sliderValue}>{negotiatedPrice.toFixed(2)} PKR</Text>
                <Text style={styles.minPriceText}>
                  (Minimum: {(Number(minPricePerUnit) * Number(selectedQuantity)).toFixed(2)} PKR)
                </Text>
              </View>
              {priceError ? (
                <Text style={styles.errorText}>{priceError}</Text>
              ) : null}
            </View>
          )}

          <View style={styles.textAreaContainer}>
            <Text style={styles.questionText}>
              {actionType === 'negotiation'
                ? 'Why are you requesting for a price negotiation?'
                : 'Why are you requesting for the free meal?'}
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Type your reason here..."
              placeholderTextColor="#888"
              value={reason}
              onChangeText={setReason}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button, 
              { 
                backgroundColor: Colors.primary,
                opacity: isLoading ? 0.7 : 1
              }
            ]}
            onPress={handleRequestSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  image: {
    width: 200,
    height: 170,
    borderRadius: 8,
    marginBottom: 10,
  },
  foodDetails: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  foodName: {
    fontSize: 20,
    fontWeight: '400',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 26,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 15,
    color: Colors.Grey,
    marginLeft: 8,
  },
  foodPrice: {
    fontSize: 15,
    color: Colors.Grey,
  },
  sliderContainer: {
    marginVertical: 16,
  },
  sliderLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  priceInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4
  },
  sliderValue: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  minPriceText: {
    fontSize: 14,
    color: Colors.dark
  },
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
    marginTop: 5
  },
  textAreaContainer: {
    marginVertical: 16,
  },
  questionText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
    color: '#000',
  },
  button: {
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

