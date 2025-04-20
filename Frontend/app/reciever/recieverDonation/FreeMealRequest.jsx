import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import Head from '../../../components/header';
import { ScrollView } from 'react-native';

export default function FreeMealRequest() {
  const searchParams = useLocalSearchParams();
  const { foodName, foodPrice, rest_time, selectedQuantity, actionType } = searchParams; 
  const navigation = useNavigation();
  const router = useRouter();

  const [negotiatedPrice, setNegotiatedPrice] = useState(Number(foodPrice*selectedQuantity));
  const [reason, setReason] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleBackPress = () => {
    router.back(); 
  };

  const handleRequestSubmit = () => {
    const requestData = {
      foodName,
      selectedQuantity,
      reason,
      negotiatedPrice: actionType == 'negotiate' ? negotiatedPrice : 0, // Only include price if negotiating
    };
    console.log('Request Submitted', requestData);
  };

  const handleSliderChange = (value) => {
    setNegotiatedPrice(value);
  };

  return (
    <View style={styles.container}>
      <Head
        showBackOption={true}
        label="Checkout"
        onBackPress={handleBackPress}
      />
      <ScrollView>
      {/* Content */}
      <View style={styles.foodDetails}>
        <Image source={require('./../../../assets/images/greenLogo.png')} style={styles.image} />
        <Text style={styles.foodName}>{foodName}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.foodDetails1}>
          <View style={styles.infoRow}>
            <Ionicons name="restaurant-outline" size={18} color="#000" />
            <Text style={styles.infoText}>{selectedQuantity || '0'} portions</Text>
          </View>
          <Text style={styles.foodPrice}>{actionType == 'negotiate' ? negotiatedPrice : '0 PKR'}</Text>
        </View>
        <View style={styles.foodDetails1}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#000" />
            <Text style={styles.infoText}>Pickup Time:</Text>
          </View>
          <Text style={styles.foodPrice}>{rest_time || 'N/A'}</Text>
        </View>

        {actionType == 'negotiate' && (
          <View style={styles.sliderContainer}>
            
            <Text style={styles.sliderLabel}>Set Your Price:</Text>
            <Slider
              style={styles.slider}
              minimumValue={30*selectedQuantity}
              maximumValue={Number(foodPrice*selectedQuantity)}
              step={1}
              value={negotiatedPrice}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor="#ddd"
            />
            <Text style={styles.sliderValue}>{negotiatedPrice} PKR</Text>
            
            
          </View>
        )}

        {/* Free Meal Request Form */}
        <View style={styles.textAreaContainer}>
          <Text style={styles.questionText}>
            {actionType === 'negotiate'
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

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.primary }]}
          onPress={handleRequestSubmit}
        >
          <Text style={styles.buttonText}>Send Request</Text>
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
  image: {
    width: 200,
    height: 170,
    resizeMode: 'cover',
  },
  foodDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 20,
    fontWeight: '400',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 26,
  },
  foodDetails1: {
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
  sliderValue: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
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
