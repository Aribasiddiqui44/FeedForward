import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { useRouter } from 'expo-router';

const UploadItem = ({ label, imageUri, onPickImage, square }) => (
  <View style={styles.uploadContainer}>
    <Text style={styles.label}>{label}</Text>
    {imageUri ? (
      <Image
        source={{ uri: imageUri }}
        style={[styles.imagePreview, square && { height: 150, width: 150 }]}
      />
    ) : (
      <TouchableOpacity onPress={onPickImage} style={styles.uploadButton}>
        <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
        <Text style={styles.uploadText}>Upload</Text>
      </TouchableOpacity>
    )}
  </View>
);

const EnhancedVolunteerRegistration = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [why, setWhy] = useState('');
  const [vehicleType, setVehicleType] = useState('None');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [nicFrontPhoto, setNicFrontPhoto] = useState(null);
  const [nicBackPhoto, setNicBackPhoto] = useState(null);
  const [licensePhoto, setLicensePhoto] = useState(null);

  // Function to pick images from the device's gallery
  const pickImage = async (key) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      // Update the respective photo based on the key provided
      if (key === 'profilePhoto') setProfilePhoto(uri);
      else if (key === 'nicFrontPhoto') setNicFrontPhoto(uri);
      else if (key === 'nicBackPhoto') setNicBackPhoto(uri);
      else if (key === 'licensePhoto') setLicensePhoto(uri);
    }
  };

  // Conditional rendering for vehicle uploads (only if a vehicle type is selected)
  const showVehicleUploads =
    vehicleType === 'Bicycle' || vehicleType === 'Bike' || vehicleType === 'Car';

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!name || !why) {
      alert('Please fill in all required fields.');
      return;
    }

    const params = {
      name,
      why,
      vehicleType,
      profilePhoto: profilePhoto || '', // Default to empty string if no photo uploaded
      nicFrontPhoto: nicFrontPhoto || '',
      nicBackPhoto: nicBackPhoto || '',
      licensePhoto: showVehicleUploads ? licensePhoto || '' : '', // Only include license if applicable
    };

    try {
      const response = await fetch('https://your-backend-url.com/api/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/volunteer/orderSuccessful?${new URLSearchParams(params).toString()}`);
      } else {
        alert('Something went wrong, please try again!');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting data.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Volunteers's Information</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          style={styles.input}
        />
        <TextInput
          value={why}
          onChangeText={setWhy}
          placeholder="Why do you want to be a volunteer?"
          multiline
          style={[styles.input, { height: 80 }]}
        />

        <View style={styles.vehicleSelectionContainer}>
          <Text style={styles.label}>Select Vehicle Type</Text>
          <View style={styles.vehicleOptions}>
            {['Bicycle', 'Bike', 'Car'].map((vehicle) => (
              <TouchableOpacity
                key={vehicle}
                onPress={() => setVehicleType(vehicle)}
                style={[styles.vehicleOption, vehicleType === vehicle && styles.selectedVehicleOption]}
              >
                <Image
                  source={{ uri: `/assets/images/${vehicle.toLowerCase()}.jpg` }}
                  style={[styles.vehicleImage, vehicleType === vehicle && styles.selectedVehicleImage]}
                />
                {vehicleType === vehicle && (
                  <Ionicons
                    name="checkmark-circle"
                    size={30}
                    color="green"
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Image upload sections */}
        <UploadItem
          label="Profile Photo"
          imageUri={profilePhoto}
          onPickImage={() => pickImage('profilePhoto')}
          square
        />
        <UploadItem
          label="NIC Front"
          imageUri={nicFrontPhoto}
          onPickImage={() => pickImage('nicFrontPhoto')}
        />
        <UploadItem
          label="NIC Back"
          imageUri={nicBackPhoto}
          onPickImage={() => pickImage('nicBackPhoto')}
        />

        {/* Conditional render for vehicle uploads (license only if vehicle is selected) */}
        {showVehicleUploads && (
          <UploadItem
            label="Driving License Photo"
            imageUri={licensePhoto}
            onPickImage={() => pickImage('licensePhoto')}
          />
        )}

        {/* Submit button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 5,
  },
  uploadContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.dark,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
  },
  uploadText: {
    color: Colors.primary,
    marginLeft: 10,
    fontWeight: '500',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  vehicleSelectionContainer: {
    marginBottom: 20,
  },
  vehicleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleOption: {
    alignItems: 'center',
  },
  vehicleImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  selectedVehicleOption: {
    borderWidth: 2,
    borderColor: 'green',
  },
  selectedVehicleImage: {
    opacity: 0.7,
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default EnhancedVolunteerRegistration;
