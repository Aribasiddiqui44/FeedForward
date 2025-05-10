import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import apiClient from '../../../utils/apiClient';

export default function Profile() {
  const router = useRouter();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);      
      const response = await apiClient.get('/user/current-user');      
      if (response.data && response.data.data) {
        setProfile(response.data.data);
      } else {
        throw new Error('Invalid profile data format');
      }
    } catch (err) {
      console.error('Profile fetch error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      setError(err.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={40} color={Colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchProfile} 
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No profile data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={profile.profileImage 
            ? { uri: profile.profileImage } 
            : require('../../../assets/images/greenLogo.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{profile.fullName || 'No name provided'}</Text>
        <Text style={styles.profileEmail}>{profile.email || 'No email provided'}</Text>
        
        {/* Display organization info if available */}
        {profile.organizationName && (
          <>
            <Text style={styles.profileOrg}>{profile.organizationName}</Text>
            {profile.organizationEmail && (
              <Text style={styles.profileEmail}>{profile.organizationEmail}</Text>
            )}
          </>
        )}
      </View>

      {/* Navigation Options */}
      <View style={styles.navOptions}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({
            pathname:'/profileDetails/personalInfo',
          params:{
            profileName:profile.fullName,
            mail:profile.email,
            phone:profile.phoneNumber
          }})}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.navText}>Personal Info</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('Address')}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="location-on" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.navText}>Address</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          //onPress={() => router.push('./../reciever/recieverImpact/RecieverImpact')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="stats-chart-outline" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.navText}>My Impact</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Messages')}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="email" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.navText}>Messages</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 30,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#fff',
  },
  profileEmail: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  profileOrg: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    fontWeight: 'bold',
  },
  navOptions: {
    marginTop: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  navText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.Grey,
  },
});