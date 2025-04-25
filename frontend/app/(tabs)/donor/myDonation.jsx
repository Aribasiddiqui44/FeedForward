import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import Head from '../../../components/header';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyListings = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
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

  const handleBackPress = () => {
    router.back();
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchDonations();
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
        
        <Text style={styles.cardDate}>Posted: {formatDate(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        My Listings
      </Text>
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
      <Head label="My Listings" showBackOption={true} onBackPress={handleBackPress} />
      <FlatList
        data={donations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>Your Food Donations ({donations.length})</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  listContent: {
    padding: 15,
  },
  header: {
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
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
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MyListings;