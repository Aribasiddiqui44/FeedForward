import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import FoodCard from '../../../components/foodCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getToken = async () => {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem('accessToken');
  } else {
    return await SecureStore.getItemAsync('accessToken');
  }
};

export default function MyOrder() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ongoing');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://localhost:8000/api/donation/receiver', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonations(response.data.donations || []);
    } catch (error) {
      console.error('Failed to fetch receiver donations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleRatePress = (donationId) => {
    router.push(`receiver/donation/${donationId}/rate`);
  };

  const handleCompletePress = (donationId) => {
    router.push(`receiver/donation/${donationId}/complete`);
  };

  const renderDonations = (statusFilter) => {
    const filtered = donations.filter(
      (donation) => donation.donationStatus?.toLowerCase() === statusFilter.toLowerCase()
    );

    if (filtered.length === 0) {
      return (
        <Text style={styles.emptyText}>
          No {statusFilter.toLowerCase()} donations.
        </Text>
      );
    }

    return filtered.map((donation, index) => (
      <FoodCard
        key={donation._id || index}
        foodName={donation.foodItems?.join(', ') || 'N/A'}
        description={donation.pickupInstructions || 'No instructions'}
        total={
          donation.donationPricing
            ? `${donation.donationPricing} PKR`
            : '0 PKR'
        }
        portions={donation.portions || 1}
        type={donation.donationType || 'General'}
        statusTime={donation.expiry || 'Unknown'}
        date={
          donation.createdAt
            ? new Date(donation.createdAt).toLocaleDateString()
            : 'N/A'
        }
        imageSource={require('../../../assets/images/biryaniPng.png')}
        showRateOption={statusFilter === 'History'}
        onRatePress={() => handleRatePress(donation._id)}
        showCompleteOption={statusFilter === 'Ongoing'}
        onCompletePress={() => handleCompletePress(donation._id)}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('Ongoing')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Ongoing' && styles.activeTabText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'History' && styles.activeTab]}
          onPress={() => setActiveTab('History')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'History' && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#00aa95" />
        ) : (
          <>
            {activeTab === 'Ongoing' && renderDonations('Ongoing')}
            {activeTab === 'History' && renderDonations('Completed')}
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
