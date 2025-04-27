import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import FoodCard from '../../../components/foodCard';
import axios from 'axios'; 

const getToken = async () => {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem('accessToken');
  } else {
    return await SecureStore.getItemAsync('accessToken');
  }
};

export default function MyRequest() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Lower Price');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    try {
      const token = await getToken();

      const response = await axios.get('http://localhost:8000/api/donation/receiver', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setDonations(response.data.donations || []);
    } catch (error) {
      console.error("Failed to fetch receiver donations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleTrackPress = (foodDetails) => {
    router.push({
      pathname: '../../TrackOrder/TrackOrder',
      params: {
        foodName: foodDetails.foodName,
        statusTime: foodDetails.statusTime,
        imageSource: foodDetails.imageSource,
        portions: foodDetails.portions,
        total: foodDetails.total,
        date: foodDetails.date,
        orderFrom: foodDetails.orderFrom,
        deliverTo: foodDetails.deliverTo
      },
    });
  };

  const handleCancelPress = () => {
    router.push('/donation');
  };

  const handleRatePress = () => {
    router.push('/donation');
  };

  const handleCompletePress = () => {
    router.push('/donation');
  };

  const renderDonations = (statusFilter) => {
    const filtered = donations.filter((donation) => donation.donationStatus === statusFilter.toLowerCase());

    if (filtered.length === 0) {
      return <Text style={styles.emptyText}>No {statusFilter.toLowerCase()} donations.</Text>;
    }

    return filtered.map((donation, index) => (
      <FoodCard
        key={donation._id || index}
        foodName={donation.foodName}
        description={donation.pickupInstructions}
        total={donation.price ? `${donation.price} PKR` : '0 PKR'}
        portions={donation.portions}
        type={donation.donationType}
        statusTime={donation.expiry}
        date={new Date(donation.createdAt).toLocaleDateString()}
        imageSource={require('../../../assets/images/biryaniPng.png')}
        showRateOption={statusFilter === 'History'}
        onRatePress={handleRatePress}
        showCompleteOption={statusFilter === 'Ongoing'}
        onCompletePress={handleCompletePress}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Lower Price' && styles.activeTab]}
          onPress={() => setActiveTab('Lower Price')}
        >
          <Text style={[styles.tabText, activeTab === 'Lower Price' && styles.activeTabText]}>Lower Price</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Donation' && styles.activeTab]}
          onPress={() => setActiveTab('Donation')}
        >
          <Text style={[styles.tabText, activeTab === 'Donation' && styles.activeTabText]}>Donation</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#00aa95" />
        ) : (
          <>
            {activeTab === 'Lower Price' && renderDonations('Ongoing')}
            {activeTab === 'Donation' && renderDonations('Ongoing')}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  activeTab: {
    borderBottomColor: '#00aa95',
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#00aa95',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
  },
});
