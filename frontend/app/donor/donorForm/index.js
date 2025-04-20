import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import Head from '../../../components/header';
import { Picker } from '@react-native-picker/picker';  // Import Picker

const DonorForm = () => {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const [organizationName, setOrganizationName] = useState('');
  const [organizationEmail, setOrganizationEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Karachi'); // State for city
  const [country, setCountry] = useState('Pakistan'); // State for country
  const [postalCode, setPostalCode] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  // State for language selection (optional)
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleSubmit = () => {
    if (organizationName && organizationEmail && address && postalCode && isChecked) {
      router.push('/(tabs)/donor/profile');
    } else {
      alert('Please fill out all fields and agree to the terms.');
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container_parent}>
      <Head
        showBackOption={true}
        label="Feed Forward"
        onBackPress={handleBackPress}
      />

      <View style={styles.container_child}>
        <Text style={styles.subHeaderText}>Donor's Form</Text>

        <Text style={styles.label}>Organization Name:</Text>
        <TextInput
          style={styles.input_text}
          placeholder="Organization Name"
          placeholderTextColor="#B0B0B0"
          value={organizationName}
          onChangeText={setOrganizationName}
        />

        <Text style={styles.label}>Organization Email:</Text>
        <TextInput
          style={styles.input_text}
          placeholder="Organization Email"
          placeholderTextColor="#B0B0B0"
          keyboardType="email-address"
          value={organizationEmail}
          onChangeText={setOrganizationEmail}
        />

        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input_text}
          placeholder="House No., Street No., Area/Sector"
          placeholderTextColor="#B0B0B0"
          value={address}
          onChangeText={setAddress}
        />

        {/* City Picker */}
        <Text style={styles.label}>City:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={city}
            onValueChange={(itemValue) => setCity(itemValue)} // Handle city change
            style={styles.picker}
          >
            <Picker.Item label="Karachi" value="Karachi" />
            <Picker.Item label="Lahore" value="Lahore" />
            <Picker.Item label="Islamabad" value="Islamabad" />
            <Picker.Item label="Rawalpindi" value="Rawalpindi" />
            <Picker.Item label="Faisalabad" value="Faisalabad" />
            <Picker.Item label="Multan" value="Multan" />
            <Picker.Item label="Peshawar" value="Peshawar" />
            <Picker.Item label="Quetta" value="Quetta" />
          </Picker>
        </View>

        {/* Country Picker */}
        <Text style={styles.label}>Country:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={country}
            onValueChange={(itemValue) => setCountry(itemValue)} // Handle country change
            style={styles.picker}
          >
            <Picker.Item label="Pakistan" value="Pakistan" />
          </Picker>
        </View>

        <Text style={styles.label}>Postal Code:</Text>
        <TextInput
          style={styles.input_text}
          placeholder="Postal Code"
          placeholderTextColor="#B0B0B0"
          keyboardType="numeric"
          value={postalCode}
          onChangeText={setPostalCode}
        />

        <View style={styles.checkboxContainer}>
          <Switch value={isChecked} onValueChange={setIsChecked} />
          <Text style={styles.agreeText}>
            I agree to the <Text style={styles.linkText}>Terms and Conditions</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
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
    backgroundColor: Colors.LightGrey,
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
    elevation: 5,
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginBottom: 15,
    elevation: 5,
  },
  picker: {
    height: 35,
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

export default DonorForm;
