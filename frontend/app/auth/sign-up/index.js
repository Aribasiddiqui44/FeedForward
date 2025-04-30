import { View, Text, Alert, Image, StyleSheet, TouchableOpacity, TextInput, Picker, ScrollView, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from './../../../constants/Colors.ts';
import { router, useNavigation, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from "axios";
import apiClient from './../../../utils/apiClient.js';
import { useLocalSearchParams } from 'expo-router';
export default function SignUp() {
  const { role } = useLocalSearchParams();  // Get role passed from RoleSelection page

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    contactNumber: '',
    role: role, 
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle input change
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle the sign-up process
  const handleSignUp = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/user/signUp', {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        userRole: formData.role,
        address: formData.address,
        contactNumber: formData.contactNumber,
      });

      if (response.status === 201) {
        Alert.alert('Success', "Account created successfully.");
        router.replace('auth/sign-in');
      } else {
        Alert.alert('Error', response.data.message || 'Signup failed.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network request failed');
      console.error('Signup error: ', err);
    } finally {
      setLoading(false);
    }
  };
  const navigation=useNavigation();

  // const [userType, setUserType] = useState('donor');

  // Disable the header for this screen
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
      {/* ScrollView to make everything scrollable */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Background Image */}
        <View style={styles.up}>
          {/* Background Image */}
          <Image 
            source={require('./../../../assets/images/whitelogo.png')}
            style={styles.image}
          />
          
          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={() => router.back()} 
          >
            <AntDesign name="leftcircleo" size={32} color="white" />
          </TouchableOpacity>
        </View>



        {/* Main Content Container */}
        <View style={styles.container}>
          {/* App Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.description}>Create Your Account</Text>
          </View>

          {/* Organization Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Organization Name</Text>
            <TextInput 
              style={styles.input_text} 
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder='Enter Organization Name'
              placeholderTextColor={Colors.Grey}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput 
              style={styles.input_text}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder='Enter Email' 
              placeholderTextColor={Colors.Grey} 
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput 
              secureTextEntry={true} 
              style={styles.input_text}
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)} 
              placeholder='Enter Password' 
              placeholderTextColor={Colors.Grey}
            />
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput 
              style={styles.input_text} 
              placeholder='Enter Address' 
              placeholderTextColor={Colors.Grey}
            />
          </View>

          {/* Contact Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contact Number</Text>
            <TextInput 
              style={styles.input_text} 
              placeholder='Enter Contact Number' 
              placeholderTextColor={Colors.Grey} 
            />
          </View>

          {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Sign Up As</Text>
            <Picker 
              selectedValue={userType}
              style={styles.picker}
              onValueChange={(itemValue) => setUserType(itemValue)}
            >
              <Picker.Item label="Donor" value="donor" />
              <Picker.Item label="Receiver" value="receiver" />
            </Picker>
          </View> */}

          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={handleSignUp} 
            disabled={loading}  // This was missing the value
          >
            <Text style={styles.signUpButtonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => router.replace('auth/sign-in')}
          >
            <Text style={styles.signInButtonText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // To ensure the content doesn't get cut off at the bottom
  },
  up:{
    backgroundColor:Colors.primary,
    height:'25%'
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  iconContainer: {
    position: 'absolute',
    top: 23,
    left: 20,
    zIndex: 10,
  },
  container: {
    backgroundColor: Colors.White,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 10,
    height: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    color: Colors.primary,
    marginBottom: 10,
  },
  description: {
    fontSize: 25,
    textAlign: 'center',
    color: Colors.Grey,
    lineHeight: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 7,
  },
  input_text: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.primary,
    backgroundColor: Colors.LightGrey,
    fontSize: 16,
  },
  picker: {
    height: 50,
    padding:15,
    width: '100%',
    backgroundColor: Colors.LightGrey,
    borderRadius: 15,
    borderColor: Colors.primary,
    borderWidth: 1,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  signUpButtonText: {
    color: Colors.White,
    fontSize: 18,
  },
  signInButton: {
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    color: Colors.primary,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
