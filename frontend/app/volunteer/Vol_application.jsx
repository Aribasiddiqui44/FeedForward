import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import Head from '../../components/header';
import {useRouter, useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';

const VolunteerApplication = () => {
  const navigation =  useNavigation(); 
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);

  const navigateToPersonalInfo = () => {
    router.push('/volunteer/personalinfo');
  };

  const navigateToDocumentSubmission = () => {
    router.push('/volunteer/document-submission');
  };

  return (
    <View style={styles.container}>
      <Head label="Volunteer's Application" showBackOption={true} onBackPress={handleBackPress} />
      
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Application Options */}
        <View style={styles.optionsContainer}>
          {/* Rider's Personal Information Option */}
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={navigateToPersonalInfo}
          >
            <View style={styles.optionContent}>
              <MaterialIcons name="person-outline" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Rider's Personal Information</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.gray} />
          </TouchableOpacity>
          
          {/* Document Submission Option */}
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={navigateToDocumentSubmission}
          >
            <View style={styles.optionContent}>
              <MaterialIcons name="description" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Document Submission</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.gray} />
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark,
    marginLeft: 15,
  },
});

export default VolunteerApplication;