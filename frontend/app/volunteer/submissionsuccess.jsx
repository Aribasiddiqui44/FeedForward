import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import Head from '../../components/header';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

const SubmissionSuccess = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId;
  const userType=params.userType;

  const handleBackToHome = () => {
    router.replace({pathname:'/volunteer/availableOrders',
  params:{userType:userType}});
  };

  useEffect(() => {
            navigation.setOptions({
              headerShown: false,
            });
          }, []);

  return (
    <View style={styles.container}>
      <Head label="Feed Forward" showBackOption={false} />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome name="check-circle" size={80} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>Documents Submitted Successfully!</Text>
        
        <Text style={styles.message}>
          Thank you for submitting your volunteer application. 
          Your documents are under review by our admin team.
        </Text>
        
        <Text style={styles.notice}>
          You will receive a notification once your application is approved.
          This process typically takes 1-3 business days.
        </Text>
        
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={handleBackToHome}
        >
            
          <MaterialIcons name="home" size={24} color="white" />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  notice: {
    fontSize: 14,
    color: Colors.Grey,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  homeButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default SubmissionSuccess;