import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import FoodCard from '../../components/foodCard';
export default function MyOrder() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ongoing');

  const handleTrackPress = (foodDetails) => {
    router.push({
      pathname: './../TrackOrder/TrackOrder',
      params: {
        foodName: foodDetails.foodName,
        statusTime: foodDetails.statusTime,
        imageSource: foodDetails.imageSource,
        portions:foodDetails.portions,
        total:foodDetails.total,
        date:foodDetails.date,
        orderFrom:foodDetails.orderFrom,
        deliverTo:foodDetails.deliverTo
      },
    });
  };

  const handleCancelPress = () => {
    router.push('/donation');
  };

  

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
        {activeTab === 'Ongoing' && (
          <>
            <FoodCard
              foodName="Chicken Biryani"
              description="Delicious surplus biryani available..."
              total="350 PKR"
              portions="7"
              type="Paid"
              statusTime="11:00 pm"
              date="29/11/2024"
              imageSource={require('./../../assets/images/biryaniPng.png')}
              showTrackButton={true}
              onTrackPress={() => handleTrackPress({
                foodName:'Chicken Karhai',
                portions:'15',
                statusTime:'11:00 pm',
                imageSource:'./../../assets/images/yum.png',
                date:'29/11/2024',
                total:'250 PKR',
                orderFrom:'Haveli restaurant',
                deliverTo:'Zariya Foundation',
              })}
              showCancelOption={true}
              onCancelPress={handleCancelPress}
            />
            <FoodCard
              foodName="Chicken Karahi"
              description="Delicious surplus karahi available..."
              total="550 PKR"
              portions="15"
              type="Unpaid"
              statusTime="11:00 pm"
              date="29/11/2024"
              imageSource={require('./../../assets/images/yum.png')}
              showTrackButton={true}
              onTrackPress={() => handleTrackPress({
                foodName:'Chicken Karhai',
                portions:'15',
                statusTime:'11:00 pm',
                imageSource:'./../../assets/images/yum.png',
                date:'29/11/2024',
                total:'250 PKR',
                orderFrom:'Haveli restaurant',
                deliverTo:'Zariya Foundation',
              })}
              showCancelOption={true}
              onCancelPress={handleCancelPress}
            />
          </>
        )}
        {activeTab === 'History' && (
          <Text style={styles.emptyText}>No history available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background color
    paddingHorizontal: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  side:{
    flexDirection:'column'
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  activeTab: {
    borderBottomColor: '#00aa95', // Active tab color
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#00aa95', // Active tab text color
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  statusBadge: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    overflow: 'hidden',
  },
  paid: {
    backgroundColor: '#e6f9f5',
    color: '#00aa95',
  },
  unpaid: {
    backgroundColor: '#ffe6e6',
    color: '#e63946',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  trackButton: {
    flex: 1,
    backgroundColor: '#00aa95',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 10,
    marginTop:8,
  },
  
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
  },
});
