

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
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
        originalPrice: request.originalPrice ? `${request.originalPrice} PKR` : '0 PKR',
        portions: request.quantity || 1,
        status: request.status,
        requestType: request.requestType,
        date: new Date(request.createdAt).toLocaleDateString(),
        imageSource: request.foodItem?.images?.[0] || require('../../../assets/images/logo.png'),
        donorName: request.donor?.name || 'Anonymous Donor',
        donorAddress: request.donor?.address || 'Address not specified',
        messages: request.messages || [],
        negotiationHistory: request.negotiationHistory || []
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

// Update the filteredRequests logic
const filteredRequests = requests.filter(request => {
  if (activeTab === 'Lower Price') {
    return request.requestType === 'negotiation';
  } else {
    return request.requestType === 'free' || request.requestType === 'explicit_free';
  }
});




  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Lower Price' && styles.activeTab]}
          onPress={() => setActiveTab('Lower Price')}
        >
          <Text style={[styles.tabText, activeTab === 'Lower Price' && styles.activeTabText]}>
            Lower Price
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Donation' && styles.activeTab]}
          onPress={() => setActiveTab('Donation')}
        >
          <Text style={[styles.tabText, activeTab === 'Donation' && styles.activeTabText]}>
  Donation 
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
              
              showPriceComparison={activeTab === 'Lower Price'}
              onPress={request.status === 'accepted' ? () => {
    router.push({
      pathname: '/orderReceipt/OrderReceipt',
      params: {
        requestId: request.id,
        foodName: request.foodName,
        totalPrice: request.price.replace(' PKR', ''),
        quantity: request.portions,
        rest_name: request.donorName,
        paymentMethod: 'cash_on_pickup',
        status: 'accepted'
      }
    });
  } : undefined}
              
            />
          ))
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