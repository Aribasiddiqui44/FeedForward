import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Picker } from 'react-native';
import { Colors } from '../../constants/Colors';
import Head from '../../components/header';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const VolunteerPersonalInfo = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [cnicNumber, setCnicNumber] = useState('');
  const [age, setAge] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('Write your answer here...');
  const [hours, setHours] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  useEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      }, []);

  const handleSubmit = () => {
    // Handle form submission
    router.push('/volunteer/document-submission');
  };

  return (
    <View style={styles.container}>
      <Head label="Personal Information" showBackOption={true} onBackPress={handleBackPress} />
      
      <ScrollView contentContainerStyle={styles.content}>
    
        <View style={styles.section}>
          <Text style={styles.label}>Enter your CNIC number</Text>
          <TextInput
            style={styles.input}
            value={cnicNumber}
            onChangeText={setCnicNumber}
            keyboardType="numeric"
          />
        </View>

        {/* Age */}
        <View style={styles.section}>
          <Text style={styles.label}>What's your age?</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        {/* Vehicle */}
        <View style={styles.section}>
          <Text style={styles.label}>What vehicle do you have?</Text>
          <TextInput
            style={styles.input}
            value={vehicle}
            onChangeText={setVehicle}
            placeholder="e.g. Motorcycle, Car, Bicycle"
          />
        </View>

        <View style={styles.divider} />

        {/* Previous Experience */}
        <View style={styles.section}>
          <Text style={styles.label}>Have you worked as a rider before?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={experience}
              onValueChange={(itemValue) => setExperience(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select an option" value="" />
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
              <Picker.Item label="Some experience" value="some" />
            </Picker>
          </View>
        </View>

        {/* Motivation */}
        <View style={styles.section}>
          <Text style={styles.label}>Why do you want to join Feed Forward as a Volunteer?</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={motivation}
            onChangeText={setMotivation}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.divider} />

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.label}>How many hours can you dedicate to volunteer service?</Text>
          <TextInput
            style={styles.input}
            value={hours}
            onChangeText={setHours}
            placeholder="e.g. 10 hours per week"
            keyboardType="numeric"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Continue to Document Submission</Text>
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark,
    marginBottom: 8,
  },
  input: {
    color: Colors.Grey,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.Grey,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    color: Colors.Grey
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    overflow: 'hidden',
    padding: 10
  },
  picker: {
    height: 50,
    width: 50,
    borderRadius: 20,
    color: Colors.Grey
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default VolunteerPersonalInfo;