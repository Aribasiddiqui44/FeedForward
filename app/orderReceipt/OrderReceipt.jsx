import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Head from '../../components/header';
import { Colors } from '../../constants/Colors';
export default function OrderReceipt() {
  const searchParams = useLocalSearchParams();
  const { foodName, foodPrice, rest_time, selectedQuantity,rest_name} = searchParams;
  const navigation = useNavigation();
  const router = useRouter();

  // Disable header for this screen
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const handleBackPress = () => {
    router.push('./../(tabs)/restaurantListing'); 
  };
  return (
    
    <View style={styles.container}>
        <Head 
        showBackOption={true}
        label='Feed Forward'
        onBackPress={handleBackPress}
      />
        <ScrollView>
        
      <Text style={styles.header}>Order Receipt</Text>

      {/* Receipt Details */}
      <View style={styles.receiptCard}>
        <Text style={styles.label}>Organization Name</Text>
        <Text style={styles.value}>{'Zariya' || 'N/A'}</Text>

        <Text style={styles.label}>Restaurant Name</Text>
        <Text style={styles.value}>{rest_name || 'N/A'}</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.tableTitle}>Items</Text>
          <Text style={styles.tableTitle}>Portions</Text>
          <Text style={styles.tableTitle}>Total</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableValue}>{foodName|| 'N/A'}</Text>
          <Text style={styles.tableValue}>{ selectedQuantity|| '0'}</Text>
          <Text style={styles.tableValue}>{ selectedQuantity* foodPrice|| '0'} PKR</Text>
        </View>

        <Text style={styles.label}>Pickup Time</Text>
        <Text style={styles.value}>{rest_time || 'N/A'}</Text>

        <Text style={styles.label}>Payment Status</Text>
        <Text style={styles.value}>{'Paid' || 'Unpaid'}</Text>

        <Text style={styles.note}>This receipt has to be shown at the time of pickup</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="share-social-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.primary,
    marginTop:19,
  },
  receiptCard: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#fff',
    margin:15,
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontWeight: 500,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: Colors.Grey,
    marginTop:6,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingBottom:16
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  tableValue: {
    fontSize: 14,
    color: '#333',
  },
  note: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  actionButton: {
    width: 50,
    height: 50,
    backgroundColor: '#00C7A8',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});
