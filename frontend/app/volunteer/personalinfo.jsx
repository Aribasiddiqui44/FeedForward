
import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Picker, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import Head from '../../components/header';
import { useNavigation, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '../../utils/apiClient';
import { useLocalSearchParams } from 'expo-router';
const VolunteerPersonalInfo = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId; 
  const navigation=useNavigation();
  useEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      }, []);
  const [formData, setFormData] = useState({
    cnicNumber: '',
    age: '',
    vehicle: '',
    experience: '',
    motivation: '',
    hours: '5'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const incrementHours = () => {
    setFormData(prev => ({
      ...prev,
      hours: Math.min(Number(prev.hours) + 1, 24).toString()
    }));
  };

  const decrementHours = () => {
    setFormData(prev => ({
      ...prev,
      hours: Math.max(Number(prev.hours) - 1, 1).toString()
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.cnicNumber || !formData.age || !formData.vehicle || 
        !formData.experience || !formData.motivation) {
      Alert.alert('Incomplete Form', 'Please fill all required fields');
      return;
    }

    // CNIC format validation
    if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnicNumber)) {
      Alert.alert('Invalid CNIC', 'Format should be XXXXX-XXXXXXX-X');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(`/api/riders/${userId}/profile`, {
        age: parseInt(formData.age),
        vehicleType: formData.vehicle,
        hasRiderExperience: formData.experience,
        motivationStatement: formData.motivation,
        weeklyAvailableHours: parseInt(formData.hours),
        cnicNumber: formData.cnicNumber
      });

      if (response.data) {
        router.push({
          pathname: '/volunteer/documents',
          params: { riderId: response.data._id } // Use the created rider ID
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Submission Failed',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Head label="Personal Information" showBackOption={true} onBackPress={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* CNIC Number */}
        <View style={styles.section}>
          <Text style={styles.label}>Enter your CNIC number</Text>
          <TextInput
            style={styles.input}
            value={formData.cnicNumber}
            onChangeText={(text) => handleChange('cnicNumber', text)}
            keyboardType="numeric"
            placeholder="42211-2953987-6"
            placeholderTextColor={Colors.Grey}
          />
        </View>

        {/* Age */}
        <View style={styles.section}>
          <Text style={styles.label}>What's your age?</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => handleChange('age', text)}
            keyboardType="numeric"
            placeholder="22"
            placeholderTextColor={Colors.Grey}
          />
        </View>

        {/* Vehicle */}
        <View style={styles.section}>
          <Text style={styles.label}>What vehicle do you have?</Text>
          <TextInput
            style={styles.input}
            value={formData.vehicle}
            onChangeText={(text) => handleChange('vehicle', text)}
            placeholder="e.g. Motorcycle, Car, Bicycle"
            placeholderTextColor={Colors.Grey}
          />
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.label}>Have you worked as a rider before?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.experience}
              onValueChange={(value) => handleChange('experience', value)}
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
          <Text style={styles.label}>Why do you want to join as a Volunteer?</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.motivation}
            onChangeText={(text) => handleChange('motivation', text)}
            multiline
            numberOfLines={4}
            placeholder="I want to contribute to my community..."
            placeholderTextColor={Colors.Grey}
          />
        </View>

        {/* Hours */}
        <View style={styles.section}>
          <Text style={styles.label}>Weekly available hours</Text>
          <View style={styles.hoursContainer}>
            <TouchableOpacity onPress={decrementHours} style={styles.hoursButton}>
              <MaterialIcons name="remove" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.hoursValue}>{formData.hours}</Text>
            <TouchableOpacity onPress={incrementHours} style={styles.hoursButton}>
              <MaterialIcons name="add" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Continue to Document Submission</Text>
          )}
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
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
    marginBottom: 15,
  },
  input: {
    color: Colors.dark,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    fontSize: 13,
    borderWidth: 1,
    borderColor: Colors.Grey,
    marginBottom: 15
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    color: Colors.dark,
    marginBottom: 10
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
    width: '100%',
    borderRadius: 20,
    color: Colors.dark,
    fontSize: 12
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  hoursButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  hoursValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
    color: Colors.Grey,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.dark,
  },
  nextStepMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.Grey,
  },
});

export default VolunteerPersonalInfo;







