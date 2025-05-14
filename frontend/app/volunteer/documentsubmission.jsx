import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Colors } from '../../constants/Colors';
import Head from '../../components/header';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const DocumentSubmission = () => {
  const navigation = useNavigation();  
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [nationalIdPhoto, setNationalIdPhoto] = useState(null);
  const [drivingLicensePhoto, setDrivingLicensePhoto] = useState(null);

  useEffect(() => {
          navigation.setOptions({
            headerShown: false,
          });
        }, []);

  const handleBackPress = () => {
    router.back();
  };

  const handleSubmit = () => {
    // Handle form submission
    router.push('/volunteer/submissionsuccess');
  };

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = (setImage) => {
    setImage(null);
  };

  return (
    <View style={styles.container}>
      <Head label="Personal Documents" showBackOption={true} onBackPress={handleBackPress} />
      
      <ScrollView contentContainerStyle={styles.content}>

        {/* Profile Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload your photo</Text>
          <Text style={styles.sectionDescription}>
            You can upload the photo from your smartphone or take a new one. 
            Help us get clear photos for verification.
          </Text>
          
          {profilePhoto ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: profilePhoto }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeImage(setProfilePhoto)}
              >
                <MaterialIcons name="delete" size={24} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => pickImage(setProfilePhoto)}
            >
              <FontAwesome name="photo" size={24} color={Colors.primary} />
              <Text style={styles.uploadButtonText}>Click here to upload your file</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* National ID Card Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload a photo of your National ID Card</Text>
          <Text style={styles.sectionDescription}>
            We need a photo of your National ID card that is used as part of your verification. 
            Your document will be securely stored.
          </Text>
          
          {nationalIdPhoto ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: nationalIdPhoto }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeImage(setNationalIdPhoto)}
              >
                <MaterialIcons name="delete" size={24} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => pickImage(setNationalIdPhoto)}
            >
              <FontAwesome name="id-card" size={24} color={Colors.primary} />
              <Text style={styles.uploadButtonText}>Click here to upload your file</Text>
            </TouchableOpacity>
          )}

          <View style={styles.supportedFormats}>
            <Text style={styles.supportedText}>Supported formats:</Text>
            <View style={styles.formatRow}>
              <MaterialIcons name="image" size={16} color={Colors.Grey} />
              <Text style={styles.formatText}>JPG</Text>
              <MaterialIcons name="image" size={16} color={Colors.Grey} />
              <Text style={styles.formatText}>PNG</Text>
              <MaterialIcons name="picture-as-pdf" size={16} color={Colors.Grey} />
              <Text style={styles.formatText}>PDF</Text>
            </View>
          </View>
        </View>

        {/* Driving License Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload a photo of your Driving License</Text>
          <Text style={styles.sectionDescription}>
            This should be a clear photo of your Driving License. 
            We need this information for verification purposes.
          </Text>
          
          {drivingLicensePhoto ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: drivingLicensePhoto }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeImage(setDrivingLicensePhoto)}
              >
                <MaterialIcons name="delete" size={24} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => pickImage(setDrivingLicensePhoto)}
            >
              <MaterialIcons name="directions-car" size={24} color={Colors.primary} />
              <Text style={styles.uploadButtonText}>Click here to upload your file</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!profilePhoto || !nationalIdPhoto || !drivingLicensePhoto) && styles.disabledButton
          ]} 
          onPress={handleSubmit}
          disabled={!profilePhoto || !nationalIdPhoto || !drivingLicensePhoto}
        >
          <Text style={styles.submitButtonText}>Submit Documents</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.dark,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.Grey,
    marginBottom: 16,
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 25,
    padding: 14,
    backgroundColor: Colors.lightPrimary,
  },
  uploadButtonText: {
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 10,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: Colors.lightGray,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
  },
  supportedFormats: {
    marginTop: 10,
    color: Colors.Grey,
  },
  supportedText: {
    marginTop: 10,
    fontSize: 12,
    color: Colors.Grey,
    marginBottom: 5,
  },
  formatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formatText: {
    fontSize: 12,
    color: Colors.Grey,
    marginRight: 15,
    marginLeft: 5,
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
  disabledButton: {
    backgroundColor: Colors.Grey,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default DocumentSubmission;