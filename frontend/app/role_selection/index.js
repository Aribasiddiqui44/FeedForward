import React from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from './../../constants/Colors';
// import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from '../../components/header';
import { useEffect, useState } from 'react';
import apiClient from '../../utils/apiClient.js';

export default function RoleSelection() {
  const navigation = useNavigation();
  const router = useRouter();
  
  const params = useLocalSearchParams();
  const userData = params.userData ? JSON.parse(params.userData) : null;

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handlePress = async (role) => {
    if( !role ) {
      Alert.alert("Select a role")
    };
    setLoading(true);
    try {
      console.log(userData);
      const response = await apiClient.patch('user/role', {
        user_id: userData.user._id,
        role
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
          // 'Content-Type': 'application/json'
        }
      }
      );
      if( response.status == 201 ){
        Alert.alert('Success', "Role updated successfully");
        router.push({
          pathname: '/auth/sign-up',
          params: { role }, // Pass the selected role as a parameter
        });

      } else {
        Alert.alert('Error', response.data.message || 'Role updation failed.')
      }
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Head
        showBackOption={true}
        label="Feed Forward"
        onBackPress={() => router.back()
        
        }
      />
      <View style={styles.header}>
        <Text style={styles.subTitle}>Become a Feed Forward</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('donor')}>
        <Text style={styles.buttonText}>DONOR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('receiver')}>
        <Text style={styles.buttonText}>RECEIVER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('rider')}>
        <Text style={styles.buttonText}>VOLUNTEER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  header: {
    width: '100%',
    alignItems: 'center',
  },
  subTitle: {
    marginVertical: 30,
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    margin: '15%',
    width: '70%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
