import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import apiClient from '../../../utils/apiClient';

const MyRequests = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const params = useLocalSearchParams();
  const { foodItemId } = params;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = foodItemId 
        ? `/request/donor/requests/${foodItemId}`
        : '/request/donor/requests';
      
      const response = await apiClient.get(endpoint);
      console.log('API Response:', response.data);

      if (response.data?.success) {
        const formattedRequests = response.data.data.map(request => {
          // Determine the tab based on requestType and status
          let tab = 'requests';
          if (request.requestType === 'direct' || request.status === 'accepted' || request.status === 'completed') {
            tab = 'orders';
          }
          
          return {
            id: request._id,
            foodItemId: request.foodItem?.id || 'unknown',
            userId: request.requester?.id || 'unknown',
            userName: request.requester?.name || 'Anonymous User',
            type: tab,
            foodItem: request.foodItem?.title || 'Food Item',
            total: request.requestType === 'negotiation' ? `${request.proposedPrice} PKR` :
                  request.requestType==='direct' ? `${request.finalPrice} PKR`:
                  '0 pkr',
            pickupTime: request.pickupDetails?.scheduledTime?.start || 'To be scheduled',
            portions: request.quantity || 1,
            date: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown date',
            status: request.status || 'pending',
            requestType: request.requestType || 'free',
            orderType: request.requestType === 'free' ? 'Free' : 
                      request.requestType === 'direct' ? 'Direct' :
                      request.requestType === 'explicit_free' ? 'Donation' :  'Negotiated',
            offerPrice: request.requestType === 'negotiation' ? `${request.proposedPrice} PKR` : request.finalPrice
          };
        });
        
        console.log('Formatted requests:', formattedRequests);
        setAllRequests(formattedRequests);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on active tab and additional conditions
  const filteredRequests = allRequests.filter(item => {
    const tabMatch = item.type === activeTab;
    if (foodItemId) {
      return tabMatch && item.foodItemId === foodItemId;
    }
    return tabMatch;
  });

  const handleRequestAction = async (id, action) => {
    try {
      let endpoint = '';
      let data = {};
      
      switch (action) {
        case 'accept':
          endpoint = `/request/requests/${id}/handle`;
          data = { action: 'accept' };
          break;
        case 'decline':
          endpoint = `/request/requests/${id}/handle`;
          data = { action: 'reject' };
          break;
        case 'complete':
          endpoint = `/request/requests/${id}/complete`;
          break;
        default:
          throw new Error('Invalid action');
      }
      
      const response = await apiClient.patch(endpoint, data);
      
      if (response.data?.success) {
        Alert.alert('Success', response.data.message || 'Action completed successfully');
        fetchRequests();
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      Alert.alert('Error', error.response?.data?.message || `Failed to ${action} request`);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.card,
      item.status === 'completed' && styles.completedCard
    ]}>
      <View style={styles.cardHeader}>
        <View style={styles.idRow}>
          <Text style={styles.idText}>
            {item.type === 'requests' ? 'Request ID' : 'Order ID'}: {item.id.slice(-6).toUpperCase()}
          </Text>
          <Text style={styles.idText}>Requester: {item.userName}</Text>
        </View>
        
        <View style={styles.titleRow}>
          <Text style={[
            styles.foodTitle,
            item.status === 'completed' && styles.completedText
          ]}>
            {item.foodItem}
          </Text>
          {item.orderType && (
            <View style={[
              styles.orderTypeBadge,
              { 
                backgroundColor: item.status === 'completed' ? Colors.Grey : 
                               item.requestType === 'free' ? Colors.primary :
                               item.requestType === 'negotiation' ? Colors.danger :
                               Colors.primary
              }
            ]}>
              <Text style={[styles.orderTypeText, { color: Colors.White }]}>
                {item.orderType}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.rowSpaceBetween}>
          <Text style={[
            styles.detailText,
            item.status === 'completed' && styles.completedText
          ]}>
            Total: {item.total}
          </Text>
          <Text style={[
            styles.detailText,
            item.status === 'completed' && styles.completedText
          ]}>
            Portions: {item.portions}
          </Text>
        </View>

        {item.requestType === 'negotiation' && (
          <View style={styles.offerPriceContainer}>
            <Text style={styles.offerPriceText}>Initial Offer: {item.offerPrice}</Text>
          </View>
        )}
          
        <View style={styles.rowSpaceBetween}>
          <Text style={[
            styles.pickupText,
            item.status === 'completed' ? styles.completedText : { color: Colors.primary }
          ]}>
            {item.status === 'completed' ? `Completed` : `Pick up: ${item.pickupTime}`}
          </Text>
          <Text style={[
            styles.dateText,
            item.status === 'completed' && styles.completedText
          ]}>
            {item.date}
          </Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <>
          <View style={styles.divider} />
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => handleRequestAction(item.id, 'accept')}
            >
              <Text style={styles.confirmText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.outlinedButton, { borderColor: Colors.primary }]}
              onPress={() => handleRequestAction(item.id, 'decline')}
            >
              <Text style={[styles.outlinedButtonText, { color: Colors.primary }]}>
                Decline
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {item.status === 'accepted' && (
        <>
          <View style={styles.divider} />
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.confirmButton, { backgroundColor: Colors.primary }]}
              onPress={() => handleRequestAction(item.id, 'complete')}
            >
              <Text style={styles.confirmText}>Mark Completed</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {item.status === 'completed' && (
        <View style={styles.completedBadgeContainer}>
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>Completed</Text>
          </View>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
              Requests
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
            onPress={() => setActiveTab('orders')}
          >
            <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
              Orders
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text>Loading requests...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
              Requests
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
            onPress={() => setActiveTab('orders')}
          >
            <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
              Orders
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="warning" size={60} color={Colors.danger} />
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchRequests}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests ({allRequests.filter(r => r.type === 'requests').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Orders ({allRequests.filter(r => r.type === 'orders').length})
          </Text>
        </TouchableOpacity>
      </View>

      {filteredRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name={activeTab === 'requests' ? "document-text" : "fast-food"} 
            size={60} 
            color={Colors.primary} 
          />
          <Text style={styles.emptyText}>
            {activeTab === 'requests' ? 'No pending requests' : 'No orders yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {activeTab === 'requests' 
              ? 'New requests will appear here' 
              : 'Accepted requests will appear here as orders'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 15,
    width: '100%',
    height: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: 'white',
  },
  cardHeader: {
    marginBottom: 10,
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  idText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  completedText: {
    color: Colors.Grey,
  },
  orderTypeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.White,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  pickupText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  offerPriceContainer: {
    marginBottom: 5,
  },
  offerPriceText: {
    fontSize: 14,
    color: Colors.danger,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 5,
    alignItems: 'center',
  },
  outlinedButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    marginLeft: 5,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  outlinedButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
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
  emptySubtext: {
    fontSize: 14,
    color: Colors.Grey,
    marginTop: 5,
    textAlign: 'center',
  },
  completedBadgeContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  completedBadge: {
    backgroundColor: Colors.Grey,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    color: Colors.White,
    fontWeight: 'bold',
    fontSize: 12,
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

export default MyRequests;