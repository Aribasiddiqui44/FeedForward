import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch requests from storage
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const storedRequests = await AsyncStorage.getItem('foodRequests');
        if (storedRequests) {
          setRequests(JSON.parse(storedRequests));
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
    
    // Refresh every 5 seconds to check for new requests
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const updatedRequests = requests.map(request => 
        request.id === requestId ? { ...request, status: 'accepted' } : request
      );
      
      await AsyncStorage.setItem('foodRequests', JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      
      // In a real app, you would notify the user here
      Alert.alert('Request Accepted', 'The user has been notified');
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const updatedRequests = requests.map(request => 
        request.id === requestId ? { ...request, status: 'declined' } : request
      );
      
      await AsyncStorage.setItem('foodRequests', JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      
      // In a real app, you would notify the user here
      Alert.alert('Request Declined', 'The user has been notified');
    } catch (error) {
      console.error('Error declining request:', error);
      Alert.alert('Error', 'Failed to decline request');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.requestCard,
      item.status === 'accepted' && styles.acceptedCard,
      item.status === 'declined' && styles.declinedCard
    ]}>
      <View style={styles.requestHeader}>
        <Text style={styles.requestType}>
          {item.requestType === 'free' ? 'Request for Free Food' : 
           item.requestType === 'discount' ? 'Request for Lower Price' : 'Purchase Request'}
        </Text>
        {item.status === 'accepted' && (
          <Text style={styles.acceptedBadge}>Accepted</Text>
        )}
        {item.status === 'declined' && (
          <Text style={styles.declinedBadge}>Declined</Text>
        )}
      </View>
      
      <Text style={styles.foodName}>{item.foodItem}</Text>
      
      {item.price && <Text style={styles.detail}>Price: {item.price} PKR</Text>}
      <Text style={styles.detail}>Portions: {item.portions}</Text>
      {item.pickupTime && <Text style={styles.detail}>Pickup Time: {item.pickupTime}</Text>}
      
      {item.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={() => handleAccept(item.id)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.declineButton}
            onPress={() => handleDecline(item.id)}
          >
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={styles.requestDate}>{new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading requests...</Text>
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="fast-food" size={50} color={Colors.primary} />
        <Text style={styles.emptyText}>No requests yet</Text>
        <Text style={styles.emptySubtext}>Customer requests will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Requests</Text>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptedCard: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.success,
  },
  declinedCard: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.danger,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  requestType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  acceptedBadge: {
    color: Colors.success,
    fontWeight: 'bold',
  },
  declinedBadge: {
    color: Colors.danger,
    fontWeight: 'bold',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  detail: {
    fontSize: 14,
    color: Colors.dark,
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: Colors.danger,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  requestDate: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 10,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: Colors.gray,
    marginTop: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default MyRequests;