import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Switch ,Platform} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../../../constants/Colors';
import apiClient from '../../../utils/apiClient';
import Head from '../../../components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const ReceiverForm = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const getToken = async () => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem('accessToken');
    } else {
      return await SecureStore.getItemAsync('accessToken');
    }
  };
  const [formData, setFormData] = useState({
    orgName: '',
    orgEmail: '',
    address: {
      location: '',
      googleLocation: '',
      near: '',
    },
    city: 'Karachi',
    country: 'Pakistan',
    postalCode: '',
    contactNumber: '',
    isAggreedToTermsAndConditions: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddressChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [key]: value }
    }));
  };

  const handleSubmit = async () => {
    const { orgName, orgEmail, address, city, country, postalCode, contactNumber, isAggreedToTermsAndConditions } = formData;

    if (!orgName || !orgEmail || !address.location || !city || !country || !postalCode || !contactNumber || !isAggreedToTermsAndConditions) {
      Alert.alert('Missing Fields', 'Please complete all fields and agree to the terms.');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.post(
        'http://localhost:8000/receiver/add',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 201) {
        Alert.alert('Success', 'Organization registered successfully!');
        router.replace('../../(tabs)/receiver/restaurantListing');
      } else {
        Alert.alert('Error', response.data?.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Network Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container_parent}>
      <Head showBackOption={true} label="Feed Forward" onBackPress={() => router.back()} />

      <View style={styles.container_child}>
        <Text style={styles.subHeaderText}>Receiver’s Form</Text>

        <Text style={styles.label}>Organization Name:</Text>
        <TextInput style={styles.input_text} placeholder="Organization Name" value={formData.orgName} onChangeText={text => handleChange('orgName', text)} />

        <Text style={styles.label}>Organization Email:</Text>
        <TextInput style={styles.input_text} placeholder="Organization Email" keyboardType="email-address" value={formData.orgEmail} onChangeText={text => handleChange('orgEmail', text)} />

        <Text style={styles.label}>Address:</Text>
        <TextInput style={styles.input_text} placeholder="House No., Street No., Area" value={formData.address.location} onChangeText={text => handleAddressChange('location', text)} />

        <Text style={styles.label}>Nearby Landmark:</Text>
        <TextInput style={styles.input_text} placeholder="Nearby Landmark" value={formData.address.near} onChangeText={text => handleAddressChange('near', text)} />

        <Text style={styles.label}>City:</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={formData.city} onValueChange={value => handleChange('city', value)} style={styles.picker}>
            {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'].map(city => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Country:</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={formData.country} onValueChange={value => handleChange('country', value)} style={styles.picker}>
            <Picker.Item label="Pakistan" value="Pakistan" />
          </Picker>
        </View>

        <Text style={styles.label}>Postal Code:</Text>
        <TextInput style={styles.input_text} placeholder="Postal Code" keyboardType="numeric" value={formData.postalCode} onChangeText={text => handleChange('postalCode', text)} />

        <Text style={styles.label}>Contact Number:</Text>
        <TextInput style={styles.input_text} placeholder="Contact Number" keyboardType="phone-pad" value={formData.contactNumber} onChangeText={text => handleChange('contactNumber', text)} />

        <View style={styles.checkboxContainer}>
          <Switch value={formData.isAggreedToTermsAndConditions} onValueChange={val => handleChange('isAggreedToTermsAndConditions', val)} />
          <Text style={styles.agreeText}>
            I agree to the <Text style={styles.linkText}>Terms and Conditions</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Register Organization'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container_parent: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  container_child: {
    flexGrow: 1,
    padding: 30,
  },
  subHeaderText: {
    fontSize: 27,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 15,
    color: '#333333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input_text: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGrey,
    elevation: 2,
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginBottom: 15,
    elevation: 2,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  agreeText: {
    color: '#333333',
    marginLeft: 10,
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReceiverForm;
