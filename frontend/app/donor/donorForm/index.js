import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Modal, FlatList, Pressable
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import Head from '../../../components/header';

const DonorForm = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Karachi');
  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [country, setCountry] = useState('Pakistan');
  const [postalCode, setPostalCode] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const cityList = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi',
    'Faisalabad', 'Multan', 'Peshawar', 'Quetta'
  ];

  const handleSubmit = () => {
    router.push({
      pathname: 'donor/Donations/chooseDonation',
      params: {
        userType: 'donor',
        donorName,
        donorEmail,
        address,
        city,
        country,
        postalCode
      }
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container_parent}>
      <Head 
        showBackOption={true}
        label='Feed Forward'
        onBackPress={handleBackPress}
      />

      <View style={styles.container_child}>
        <Text style={styles.subHeaderText}>Donor's Form</Text>

        {/* Donor Name */}
        <Text style={styles.label}>Donor Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Donor Name"
          placeholderTextColor="#B0B0B0"
          value={donorName}
          onChangeText={setDonorName}
        />

        {/* Donor Email */}
        <Text style={styles.label}>Donor Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Donor Email"
          placeholderTextColor="#B0B0B0"
          keyboardType="email-address"
          value={donorEmail}
          onChangeText={setDonorEmail}
        />

        {/* Address */}
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          placeholder="House No., Street No., Area/Sector"
          placeholderTextColor="#B0B0B0"
          value={address}
          onChangeText={setAddress}
        />

        {/* Custom City Picker */}
        <Text style={styles.label}>City:</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setCityModalVisible(true)}
        >
          <Text style={styles.pickerText}>{city}</Text>
        </TouchableOpacity>

        {/* City Modal */}
        <Modal visible={isCityModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <FlatList
                data={cityList}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.modalItem}
                    onPress={() => {
                      setCity(item);
                      setCityModalVisible(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </Pressable>
                )}
              />
              <TouchableOpacity onPress={() => setCityModalVisible(false)}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Country */}
        <Text style={styles.label}>Country:</Text>
        <TextInput
          style={styles.input}
          value={country}
          onChangeText={setCountry}
        />

        {/* Postal Code */}
        <Text style={styles.label}>Postal Code:</Text>
        <TextInput
          style={styles.input}
          placeholder="Postal Code"
          placeholderTextColor="#B0B0B0"
          keyboardType="numeric"
          value={postalCode}
          onChangeText={setPostalCode}
        />

        {/* Terms Switch */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.switchBox}>
            <View style={[styles.switchDot, isChecked && styles.switchDotActive]} />
          </TouchableOpacity>
          <Text style={styles.agreeText}>
            I agree to the <Text style={styles.linkText}>Terms and Conditions</Text>
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!donorName || !donorEmail || !address || !postalCode || !isChecked}
        >
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
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    marginBottom: 15,
  },
  pickerText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    maxHeight: '50%',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeModalText: {
    textAlign: 'center',
    marginTop: 15,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchBox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchDot: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
    borderRadius: 6,
  },
  switchDotActive: {
    backgroundColor: Colors.primary,
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
