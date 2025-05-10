

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FoodCard from '../../../components/foodCard';
import apiClient from '../../../utils/apiClient';
import { Colors } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function MyRequest() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Lower Price');
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
          messages: request.messages || []
        }));

        setRequests(formattedRequests);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
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

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'Lower Price') {
      return request.requestType === 'negotiation';
    } else {
      return request.requestType === 'free' || request.requestType === 'explicit_free';
    }
  });

  // ... rest of your component remains the same
  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Lower Price' && styles.activeTab]}
          onPress={() => setActiveTab('Lower Price')}
        >
          <Text style={[styles.tabText, activeTab === 'Lower Price' && styles.activeTabText]}>
            Lower Price ({requests.filter(r => r.requestType === 'negotiation').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Donation' && styles.activeTab]}
          onPress={() => setActiveTab('Donation')}
        >
          <Text style={[styles.tabText, activeTab === 'Donation' && styles.activeTabText]}>
            Donation ({requests.filter(r => r.requestType === 'free').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name={activeTab === 'Lower Price' ? "pricetag" : "gift"} 
              size={60} 
              color={Colors.primary} 
            />
            <Text style={styles.emptyText}>
              {activeTab === 'Lower Price' ? 'No price negotiation requests' : 'No free donation requests'}
            </Text>
          </View>
        ) : (
          filteredRequests.map(request => (
            <FoodCard
              key={request.id}
              foodName={request.foodName}
              description={request.description}
              total={request.price}
              originalPrice={request.originalPrice}
              portions={request.portions}
              type={request.requestType === 'free' ? 'Free' : 'Negotiated'}
              status={request.status}
              date={request.date}
              imageSource={request.imageSource}
              showCancelOption={request.status === 'pending'}
              onCancelPress={() => handleCancelRequest(request.id)}
              showPriceComparison={activeTab === 'Lower Price'}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

// ... keep your existing styles

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