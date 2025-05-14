// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import FoodCard from '../../../components/foodCard';
// import apiClient from '../../../utils/apiClient';
// import { Colors } from '../../../constants/Colors';
// import { Ionicons } from '@expo/vector-icons';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FoodCard from '../../../components/foodCard';
import apiClient from '../../../utils/apiClient';
import { Colors } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function MyDonation() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ongoing');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add query parameter to only fetch explicit_free requests
      const response = await apiClient.get('/request/receiver/requests');
      
      if (response.data?.success) {
        const formattedRequests = response.data.data.map(request => ({
          id: request._id,
          foodName: request.foodItem?.title || 'Food Item',
          description: request.foodItem?.description || 'No description available',
          price: request.proposedPrice ? `${request.proposedPrice} PKR` : '0 PKR',
          originalPrice: request.foodItem?.price?.value ? 
                        `${request.foodItem.price.value} PKR` : '0 PKR',
          portions: request.quantity || 1,
          status: request.status,
          requestType: request.requestType,
          date: new Date(request.createdAt).toLocaleDateString(),
          imageSource: request.foodItem?.images?.[0] || require('../../../assets/images/logo.png'),
          donorName: request.donor?.name || 'Anonymous Donor',
          donorAddress: request.donor?.address || 'Address not specified',
          messages: request.messages || [],
          pickupTime: request.pickupDetails?.scheduledTime
        }));

        setRequests(formattedRequests);
      }
    } catch (err) {
      console.error('Error fetching explicit free requests:', err);
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await apiClient.patch(`/request/requests/${requestId}/handle`, {
        action: 'reject'
      });
      
      if (response.data?.success) {
        Alert.alert('Success', 'Request cancelled successfully');
        fetchRequests();
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to cancel request');
    }
  };

  // Filter requests by status and ensure they're explicit_free
  const filteredRequests = requests.filter(request => {
    if (activeTab === 'Ongoing') {
      return request.status !== 'completed' && request.status !== 'rejected' && request.requestType==='explicit_free';
    } else {
      return request.status === 'completed'&& request.requestType==='explicit_free';
    }
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchRequests}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('Ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'Ongoing' && styles.activeTabText]}>
            Ongoing 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'History' && styles.activeTab]}
          onPress={() => setActiveTab('History')}
        >
          <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>
            History 
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="gift" 
              size={60} 
              color={Colors.primary} 
            />
            <Text style={styles.emptyText}>
              {activeTab === 'Ongoing' ? 'No ongoing explicit free donations' : 'No history of explicit free donations'}
            </Text>
          </View>
        ) : (
          filteredRequests.map(request => (
            <FoodCard
              key={request.id}
              foodName={request.foodName}
              description={request.description}
              total={request.price}
              portions={request.portions}
              rest_name={request.donorName}
              type="Donation"
              status={request.status}
              date={request.date}
              imageSource={request.imageSource}
              donorName={request.donorName}
              donorAddress={request.donorAddress}
              pickupTime={request.pickupTime}
              showCancelOption={request.status === 'pending' && activeTab === 'Ongoing'}
              onCancelPress={() => handleCancelRequest(request.id)}
              showRateOption={activeTab === 'History'}
              onRatePress={() => router.push(`/receiver/request/${request.id}/rate`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

// ... keep your existing styles ...

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
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: Colors.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});