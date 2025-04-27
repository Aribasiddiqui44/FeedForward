import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { useLocalSearchParams } from 'expo-router';

const MyRequests = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([
    {
      id: 'REQ-001',
      foodItemId: '1',
      userId: 'USER-123',
      type: 'requests',
      foodItem: 'Chicken Biryani',
      total: '350 pkr',
      pickupTime: '11:00 pm',
      portions: 7,
      date: '29/11/2024',
      // action: 'Request for free food',
      status: 'pending',
      orderType: 'Free'
    },
    {
      id: 'REQ-002',
      userId: 'USER-456',
      type: 'requests',
      foodItem: 'Chicken Biryani',
      total: '350 pkr',
      pickupTime: '11:00 pm',
      portions: 7,
      date: '29/11/2024',
      // action: 'Request for lower price',
      offerPrice: '250 pkr',
      status: 'pending',
      orderType: 'Discounted'
    },
    {
      id: 'ORD-001',
      userId: 'USER-789',
      type: 'order',
      foodItem: 'Beef Steak',
      total: '1200 pkr',
      pickupTime: '8:00 pm',
      portions: 2,
      date: '30/11/2024',
      status: 'completed',
      completedTime: '8:30 pm',
      orderType: 'Original'
    },
    {
      id: 'ORD-002',
      userId: 'USER-101',
      type: 'order',
      foodItem: 'Vegetable Pizza',
      total: '800 pkr',
      offerPrice: '450 pkr',
      pickupTime: '7:00 pm',
      portions: 4,
      date: '30/11/2024',
      status: 'confirmed',
      orderType: 'Discounted'
    }
  ]);
  
  const params = useLocalSearchParams();
  const { foodItemId } = params;

  const filteredRequests = requests.filter(item => 
    item.type === activeTab && 
    (foodItemId ? item.foodItemId === foodItemId : true)
  );

  const handleConfirm = (id) => {
    setRequests(requests.map(request => {
      if (request.id === id) {
        const isFreeFood = request.orderType === 'Free';
        const isDiscount = request.orderType === 'Discounted';
        
        return {
          ...request,
          type: 'order',
          status: 'confirmed',
          total: isFreeFood ? '0 pkr' : (isDiscount ? request.offerPrice : request.total),
          orderType: isFreeFood ? 'Free' : (isDiscount ? 'Discounted' : 'Original')
        };
      }
      return request;
    }));
  };

  const handleComplete = (id) => {
    setRequests(requests.map(request => {
      if (request.id === id) {
        return {
          ...request,
          status: 'completed',
          completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return request;
    }));
  };

  const handleDecline = (id) => {
    setRequests(requests.filter(request => request.id !== id));
  };

  const getOrderTypeBadge = (orderType) => {
    return { 
      text: orderType || '',
      bgColor: Colors.primary,
      textColor: Colors.White
    };
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.card,
      item.status === 'completed' && styles.completedCard
    ]}>
      <View style={styles.cardHeader}>
        <View style={styles.idRow}>
          <Text style={styles.idText}>
            {item.type === 'requests' ? 'Request ID' : 'Order ID'}: {item.id}
          </Text>
          <Text style={styles.idText}>User ID: {item.userId}</Text>
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
              { backgroundColor: item.status === 'completed' ? Colors.Grey : getOrderTypeBadge(item.orderType).bgColor }
            ]}>
              <Text style={[styles.orderTypeText, { color: getOrderTypeBadge(item.orderType).textColor }]}>
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
            Portions {item.portions}
          </Text>
        </View>

        {item.orderType === 'Discounted' && (
            <View style={[
              styles.offerPriceText,
            ]}>
              <Text style={styles.offerPriceText}>Discounted Price: {item.offerPrice}</Text>
            </View>
          )}
          
        <View style={styles.rowSpaceBetween}>
          <Text style={[
            styles.pickupText,
            item.status === 'completed' ? styles.completedText : { color: Colors.primary }
          ]}>
            {item.status === 'completed' ? `Completed at: ${item.completedTime}` : `Pick up time: ${item.pickupTime}`}
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
              onPress={() => handleConfirm(item.id)}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.outlinedButton, { borderColor: Colors.primary }]}
              onPress={() => handleDecline(item.id)}
            >
              <Text style={[styles.outlinedButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {item.status === 'confirmed' && (
        <>
          <View style={styles.divider} />
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.confirmButton, { backgroundColor: Colors.green }]}
              onPress={() => handleComplete(item.id)}
            >
              <Text style={styles.confirmText}>Mark as Completed</Text>
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
          style={[styles.tab, activeTab === 'order' && styles.activeTab]}
          onPress={() => setActiveTab('order')}
        >
          <Text style={[styles.tabText, activeTab === 'order' && styles.activeTabText]}>
            Orders
          </Text>
        </TouchableOpacity>
      </View>

      {filteredRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="fast-food" size={60} color={Colors.primary} />
          <Text style={styles.emptyText}>
            {activeTab === 'requests' ? 'No pending requests' : 'No orders yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {activeTab === 'requests' 
              ? 'New requests will appear here' 
              : 'Confirmed orders will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
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
    // marginBottom: 10,
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
  requestSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  requestText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  offerPriceText: {
    fontSize: 14,
    color: Colors.danger,
    marginBottom: 5,
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
    // marginTop: 10,
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
});

export default MyRequests;