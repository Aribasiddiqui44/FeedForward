import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import FoodCard from '../../../components/foodCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

      const response = await fetch('http://localhost:8000/api/donation/receiver', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setDonations(data.donations || []);
    } catch (error) {
      console.error("Failed to fetch receiver donations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleRatePress = () => {
    router.push('receiver/donation');
  };

  const handleCompletePress = () => {
    router.push('receiver/donation');
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
          style={[styles.tab, activeTab === 'Ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('Ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'Ongoing' && styles.activeTabText]}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'History' && styles.activeTab]}
          onPress={() => setActiveTab('History')}
        >
          <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>History</Text>
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
  side: {
    flexDirection: 'column'
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  statusBadge: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    overflow: 'hidden',
  },
  paid: {
    backgroundColor: '#e6f9f5',
    color: '#00aa95',
  },
  unpaid: {
    backgroundColor: '#ffe6e6',
    color: '#e63946',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  trackButton: {
    flex: 1,
    backgroundColor: '#00aa95',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 10,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
  },
});
