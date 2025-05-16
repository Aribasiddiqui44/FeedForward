// DonorActivity.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import apiClient from '../../../utils/apiClient';

const DonorActivity = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/request/donor/activity');
      if (res.data?.success) {
        const formatted = [
          ...res.data.data.requests.map(item => formatItem(item, 'requests')),
          ...res.data.data.orders.map(item => formatItem(item, 'orders')),
        ];
        setAllData(formatted);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatItem = (item, type) => {
  // Determine type based on status/requestType
  let tab = 'requests';
  if (
    item.requestType === 'direct' || 
    item.status === 'accepted' || 
    item.status === 'completed'
  ) {
    tab = 'orders';
  }

  const isNegotiation = item.requestType === 'negotiation';
  const isFree = item.requestType === 'free' || item.requestType === 'explicit_free';

  return {
    id: item._id,
    type: tab,
    userName: item?.requester?.name || item?.receiver?.name || 'User',
    foodItem: item?.foodItem?.title || item?.donation?.donationFoodTitle || 'Food',
    total: item.requestType === 'negotiation'
      ? `${item.proposedPrice} PKR`
      : item.requestType === 'direct'
        ? `${item.finalPrice || item.orderTotal} PKR`
        : '0 PKR',
    portions: item.quantity || item?.items?.[0]?.quantity || 1,
    pickupTime: item?.pickupDetails?.scheduledTime?.start || 'To be scheduled',
    date: new Date(item.createdAt).toLocaleDateString(),
    status: item.status || item.orderStatus || 'pending',
    requestType: item.requestType || 'free',
    orderType: isFree
      ? 'Donation'
      : isNegotiation
        ? 'Negotiated'
        : 'Direct',
    offerPrice: isNegotiation ? `${item.proposedPrice} PKR` : item.finalPrice
  };
};


  const filtered = allData.filter(item => item.type === activeTab);

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.status === 'completed' && styles.completedCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.idRow}>
          <Text style={styles.idText}>{item.type === 'requests' ? 'Request' : 'Order'} ID: {item.id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.idText}>User: {item.userName}</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={[styles.foodTitle, item.status === 'completed' && styles.completedText]}>{item.foodItem}</Text>
          <View style={[styles.orderTypeBadge, { backgroundColor: Colors.primary }]}>
            <Text style={styles.orderTypeText}>{item.listingType}</Text>
          </View>
        </View>
        <View style={styles.rowSpaceBetween}>
          <Text style={styles.detailText}>Total: {item.total} PKR</Text>
          <Text style={styles.detailText}>Portions: {item.portions}</Text>
        </View>
        {item.offerPrice && <Text style={styles.offerPriceText}>Offer: {item.offerPrice}</Text>}
        <View style={styles.rowSpaceBetween}>
          <Text style={styles.pickupText}>Pickup: {item.pickupTime}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />;
  if (error) return <Text style={{ textAlign: 'center', marginTop: 50 }}>{error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {['requests', 'orders'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={filtered} keyExtractor={item => item.id} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 50 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8', padding: 15 },
  tabContainer: { flexDirection: 'row', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.primary },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: Colors.primary },
  tabText: { fontSize: 16, color: '#666' },
  activeTabText: { color: Colors.primary, fontWeight: 'bold' },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15 },
  completedCard: { backgroundColor: '#f0f0f0' },
  cardHeader: { marginBottom: 10 },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  idText: { fontSize: 12, color: '#666', fontStyle: 'italic' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  foodTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  completedText: { color: Colors.Grey },
  orderTypeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  orderTypeText: { fontSize: 12, fontWeight: 'bold', color: Colors.White },
  rowSpaceBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  detailText: { fontSize: 14, color: '#666' },
  pickupText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  dateText: { fontSize: 12, color: '#999' },
  offerPriceText: { color: Colors.danger, marginTop: 4, fontWeight: 'bold' },
});

export default DonorActivity;
