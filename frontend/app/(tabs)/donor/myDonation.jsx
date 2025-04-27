import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyListings = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const storedDonations = await AsyncStorage.getItem('foodDonations');
      if (storedDonations) {
        setDonations(JSON.parse(storedDonations));
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchDonations();
  };

  const handleDelete = (id) => {    
    deleteDonation(id.toString());
  };

  const deleteDonation = async (id) => {
    try {
      console.log("Deleting donation with ID:", id);
      const updatedDonations = donations.filter(item => item.id.toString() !== id);
      console.log("Updated donations:", updatedDonations);
  
      await AsyncStorage.setItem('foodDonations', JSON.stringify(updatedDonations));
      setDonations(updatedDonations);
    } catch (error) {
      console.error('Error deleting donation:', error);
      Alert.alert("Error", "Failed to delete the listing");
    }
  };
  
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push({
          pathname: '/donor/Donations/donationDetails',
          params: { donation: JSON.stringify(item) }
        })}
      >
        {item.images && item.images.length > 0 && (
          <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
          
          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="pricetag" size={16} color={Colors.primary} />
              <Text style={styles.detailText}>{item.price}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={16} color={Colors.primary} />
              <Text style={styles.detailText}>{item.pickupTime}</Text>
            </View>
          </View>
          
          {/* Views and Requests Containers */}
          <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="eye" size={16} color={Colors.primary} />
                  <Text style={styles.statText}>{item.views || 0} views</Text>
                </View>      
                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: '/donor/myRequests',
                    params: { foodItemId: item.id } // Pass the specific food item ID
                  })}
                >
                <View style={styles.statItem}>
                  <Ionicons name="bag" size={16} color={Colors.dark} />
                  <Text style={styles.statText}>{item.requests || 0} requests</Text>
                </View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.cardDate}>Posted: {formatDate(item.createdAt)}</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}

        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash" size={16} color={Colors.danger} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>My Listing</Text>
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => router.push('donor/Donations/makeDonation')}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
        <View style={styles.loadingContainer}>
          <Text>Loading your listings...</Text>
        </View>
      </View>
    );
  }

  if (donations.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="fast-food" size={60} color={Colors.primary} />
          <Text style={styles.emptyText}>No listings yet</Text>
          <Text style={styles.emptySubtext}>Your food donations will appear here</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/Donations/MakeDonationForm')}
          >
            <Text style={styles.addButtonText}>Add Your First Listing</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerIcons}>
        <Text style={styles.header}>My Listing</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('donor/Donations/makeDonation')}
          >
            <Ionicons name="add" size={26} color={Colors.White} />
          </TouchableOpacity>
        </View>
      <FlatList
        data={donations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Space between icons
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  listContent: {
    padding: 15,
  },
  cardContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.dark,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.dark,
    marginBottom: 10,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 5,
    fontSize: 13,
    color: Colors.dark,
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
    color: '#666',
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    width: 35,
    height: 35,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:3
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },
  statText: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.dark,
  },
});

export default MyListings;