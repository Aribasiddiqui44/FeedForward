import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import FoodCard from '../../../components/foodCard';

export default function MyRequest() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Lower Price');

  const handleTrackPress = (foodDetails) => {
    router.push({
      pathname: '../../TrackOrder/TrackOrder',
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

  const handleRatePress = () => {
    router.push('/donation');
  };
  const handleCompletePress = () => {
    router.push('/donation');
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Lower Price' && styles.activeTab]}
          onPress={() => setActiveTab('Lower Price')}
        >
          <Text style={[styles.tabText, activeTab === 'Lower Price' && styles.activeTabText]}>Lower Price</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Donation' && styles.activeTab]}
          onPress={() => setActiveTab('Donation')}
        >
          <Text style={[styles.tabText, activeTab === 'Donation' && styles.activeTabText]}>Donation</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        {activeTab === 'Lower Price' && (
          <>
            <FoodCard
              foodName="Chicken Biryani"
              description="Delicious surplus biryani at a lower price..."
              total="250 PKR"
              portions="7"
              type="Paid"
              statusTime="11:00 pm"
              date="29/11/2024"
              imageSource={require('../../../assets/images/biryaniPng.png')}
              showTrackButton={true}
              onTrackPress={() => handleTrackPress({
                foodName:'Chicken Biryani',
                portions:'7',
                statusTime:'11:00 pm',
                imageSource:'../../../assets/images/biryaniPng.png',
                date:'29/11/2024',
                total:'250 PKR',
                orderFrom:'Haveli restaurant',
                deliverTo:'Zariya Foundation',
              })}
              //onTrackPress={handleTrackPress}
              showCancelOption={true}
              onCancelPress={handleCancelPress}
            />
            <FoodCard
              foodName="Chicken Karahi"
              description="Delicious surplus karahi at a lower price..."
              total="350 PKR"
              portions="15"
              type="Paid"
              statusTime="11:00 pm"
              date="29/11/2024"
              imageSource={require('../../../assets/images/yum.png')}
              showTrackButton={true}
              onTrackPress={() => handleTrackPress({
                foodName:'Chicken Karhai',
                portions:'15',
                statusTime:'11:00 pm',
                imageSource:'../../../assets/images/yum.png',
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
        {activeTab === 'Donation' && (
          <>
            <FoodCard
              foodName="Vegetable Curry"
              description="Vegetable curry available for donation..."
              total="0 PKR"
              portions="10"
              type="Free"
              statusTime="10:00 pm"
              date="28/11/2024"
              imageSource={require('../../../assets/images/logo.png')}
              showRateOption={true}
              onRatePress={handleRatePress}
              showCompleteOption={true}
              onCompletePress={handleCompletePress}
            />
            <FoodCard
              foodName="Rice and Beans"
              description="Rice and beans available for donation..."
              total="0 PKR"
              portions="8"
              type="Free"
              statusTime="9:00 pm"
              date="27/11/2024"
              imageSource={require('../../../assets/images/Land.jpg')}
              showRateOption={true}
              onRatePress={handleRatePress}
              showCompleteOption={true}
              onCompletePress={handleCompletePress}
            />
          </>
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
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
  },
});
