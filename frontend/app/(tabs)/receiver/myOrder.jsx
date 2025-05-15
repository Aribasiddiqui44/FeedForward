import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import FoodCard from '../../../components/foodCard';
import apiClient from '../../../utils/apiClient';
import { Colors } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function MyOrder() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ongoing');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/order/receiver');
      console.log('Orders API Response:', response.data);

      if (response.data?.success) {
        const formattedOrders = response.data.data.map(order => ({
          id: order._id,
          time: order.pickupDetails?.scheduledTime ? 
            `${order.pickupDetails.scheduledTime.startingTime || 'N/A'} - ${order.pickupDetails.scheduledTime.endingTime || 'N/A'}` : 
            '1pm',
          foodName: order.donation?.donationFoodTitle || 'Food Item',
          total: order.orderTotal ? `${order.orderTotal} PKR` : '0 PKR',
          portions: order.items?.[0]?.quantity || 1,
          type: order.paymentStatus === 'completed' ? 'Paid' : 'Unpaid',
          status: order.orderStatus,
          date: new Date(order.createdAt).toLocaleDateString(),
          imageSource: order.donation?.listingImages?.[0] || require('../../../assets/images/greenLogo.png'),
          donorName: order.donor?.fullName || 'Anonymous Donor',
          donorAddress: order.pickupDetails?.address || 'Address not specified',
          donorPhone: order.pickupDetails?.contactNumber || 'Phone not available'
        }));

        setOrders(formattedOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

 const handleTrackPress = (order) => {
  router.push({
    pathname: '../../TrackOrder/TrackOrder',
    params: {
      foodName: order.foodName,
      statusTime: order.time,
      imageSource: order.imageSource,
      portions: order.portions,
      total: order.total,
      date: order.date,
      orderFrom: order.donorName,
      deliverTo: order.receiver?.fullName || "Your Location",
      orderStatus: order.status,
      orderId: order.id, // pass for polling
      status:order.status
    },
  });
};


  const handleCancelPress = async (orderId, donationId, portions) => {
    try {
      const response = await apiClient.patch(`/order/receiver/cancel/${orderId}`);
      
      if (response.data?.success) {
        // Optimistically update the UI
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, orderStatus: 'cancelled' } 
              : order
          )
        );
        //Alert.alert('Success', 'Order cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      //Alert.alert('Error', error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Ongoing') {
      return order.status !== 'delivered' && order.status !== 'cancelled';
    } else {
      return order.status === 'delivered' || order.status === 'cancelled';
    }
  });

  if (loading) {
    return (
      <View style={styles.container}>
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text>Loading orders...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
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
        <View style={styles.emptyContainer}>
          <Ionicons name="warning" size={60} color={Colors.danger} />
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchOrders}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
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
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name={activeTab === 'Ongoing' ? "fast-food" : "time"} 
              size={60} 
              color={Colors.primary} 
            />
            <Text style={styles.emptyText}>
              {activeTab === 'Ongoing' ? 'No ongoing orders' : 'No order history'}
            </Text>
          </View>
        ) : (
          filteredOrders.map(order => (
            <FoodCard
              key={order.id}
              foodName={order.foodName}
              description={order.description}
              total={order.total}
              portions={order.portions}
              type={order.type}
              status={order.time}
              rest_name={order.donorName}
              phone={order.donorPhone}
              showPhoneNumber={activeTab === 'Ongoing'}
              statusTime={order.date}
              imageSource={order.imageSource}
              showTrackButton={activeTab === 'Ongoing'}
              onTrackPress={() => handleTrackPress(order)}
              showCancelOption={activeTab === 'Ongoing' && order.status !== 'cancelled'}
              onCancelPress={() => handleCancelPress(order.id, order.donationId, order.portions)}
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