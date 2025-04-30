import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import Head from '../../../components/header';
import { useNavigation, useRouter } from 'expo-router';
import apiClient from '../../../utils/apiClient';

export default function MakeDonationForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customQuantity, setCustomQuantity] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [daysListed, setDaysListed] = useState(5);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navigation= useNavigation();
  useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);
  
  const handleQuantitySelect = (value) => {
    if (value === 'OTHER') {
      setQuantity(0);
    } else {
      setQuantity(parseInt(value));
      setCustomQuantity('');
    }
  };

  const pickImage = async () => {
    if (images.length >= 10) {
      Alert.alert('Limit Reached', 'You can upload up to 10 images only.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (!title || !description || (!quantity && !customQuantity)) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Basic fields
      formData.append('donationFoodTitle', title);
      formData.append('donationDescription', description);

      // Nested objects
      formData.append('donationUnitPrice', JSON.stringify({
        value: parseFloat(price) || 0,
        currency: "pkr"
      }));

      formData.append('donationQuantity', JSON.stringify({
        quantity: quantity === 0 ? parseFloat(customQuantity) : quantity,
        measurementUnit: "kg"
      }));

      formData.append('donationInitialPickupTimeRange', JSON.stringify({
        startingTime: pickupTime.split('-')[0]?.trim() || pickupTime,
        endingTime: pickupTime.split('-')[1]?.trim() || pickupTime
      }));

      formData.append('donationPickupInstructions', JSON.stringify(
        instructions ? [instructions] : []
      ));

      formData.append('goodnessOfFood', JSON.stringify({
        bestBefore: new Date(),
        listedFor: {
          period: daysListed,
          timeUnit: "days"
        }
      }));

      // // Image uploads
      // await Promise.all(images.map(async (uri, index) => {
      //   const filename = uri.split('/').pop();
      //   const match = /\.(\w+)$/.exec(filename);
      //   const type = match ? `image/${match[1]}` : 'image/jpeg';
        
      //   const response = await fetch(uri);
      //   const blob = await response.blob();
      //   formData.append('donationImages', blob, filename || `image_${index}.jpg`);
      // }));
      // const uri = images[0]; // Take the first image (or whichever one you want to send)
      // const filename = uri.split('/').pop();
      // const match = /\.(\w+)$/.exec(filename);
      // const type = match ? `image/${match[1]}` : 'image/jpeg';

      // const img = await fetch(uri);
      // const blob = await img.blob();
      // formData.append('donationImages', blob, filename || 'image.jpg');
// Take only the first 3 images (or fewer if less than 3 exist)
      const imagesToUpload = images.slice(0, 3);

      await Promise.all(
        imagesToUpload.map(async (uri, index) => {
          const filename = uri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          const img = await fetch(uri);
          const blob = await img.blob();
          formData.append('donationImages', blob, filename || `image_${index}.jpg`);
        })
      );
      console.log("calling api");
      const response = await apiClient.post('/api/donation/create', formData);

      if (response.status == 201) {
        Alert.alert('Success', 'Donation created successfully');
        router.push('/donor/myDonation');
      }
    } catch (error) {
      console.error('Donation error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.headContainer}>
      <Head label="Feed Forward" showBackOption={true} onBackPress={() => router.back()} />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Food Details:</Text>
        
        {/* Image Upload Section */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Add up to 10 images</Text>
          <View style={styles.imageContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 10 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Ionicons name='add-circle' size={40} color="#14a88b" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Chicken Biryani"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Describe your food item"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Price Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price (in PKR)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 50"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        {/* Quantity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.quantityButton,
                  quantity === num && styles.selectedQuantity
                ]}
                onPress={() => handleQuantitySelect(num)}
              >
                <Text style={quantity === num ? styles.selectedQuantityText : styles.quantityText}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity === 0 && styles.selectedQuantity
              ]}
              onPress={() => handleQuantitySelect('OTHER')}
            >
              <Text style={quantity === 0 ? styles.selectedQuantityText : styles.quantityText}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
          {quantity === 0 && (
            <TextInput
              style={styles.input}
              placeholder="Enter custom quantity"
              value={customQuantity}
              onChangeText={setCustomQuantity}
              keyboardType="numeric"
            />
          )}
        </View>

        {/* Pickup Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pick up time</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 4pm-7pm"
            value={pickupTime}
            onChangeText={setPickupTime}
          />
        </View>

        {/* Pickup Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Any pick up instructions</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="e.g. On reaching the location, send me a message"
            multiline
            numberOfLines={3}
            value={instructions}
            onChangeText={setInstructions}
          />
        </View>

        {/* Days Listed Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>List for</Text>
          <View style={styles.daysContainer}>
            {[1, 3, 5, 7].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.daysButton,
                  daysListed === days && styles.selectedDays
                ]}
                onPress={() => setDaysListed(days)}
              >
                <Text style={daysListed === days ? styles.selectedDaysText : styles.daysText}>
                  {days} {days === 1 ? 'day' : 'days'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headContainer: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.LightGrey,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.dark,
  },
  input: {
    borderWidth: 1,
    color: Colors.Grey,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    backgroundColor: '#f9f9f9',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  imageSection: {
    marginBottom: 25,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  quantityContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  quantityButton: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    minWidth: 48,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectedQuantity: {
    backgroundColor: Colors.primary,
    borderColor: '#ddd',
  },
  quantityText: {
    color: '#333',
  },
  selectedQuantityText: {
    color: 'white',
    fontWeight: 'bold',
  },
  daysContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  daysButton: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedDays: {
    backgroundColor: Colors.primary,
    borderColor: '#ddd',
  },
  daysText: {
    color: '#333',
  },
  selectedDaysText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});