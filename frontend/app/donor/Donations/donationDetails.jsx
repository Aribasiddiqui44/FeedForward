import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import Head from '../../../components/header';
import { useLocalSearchParams, useRouter,useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const DonationDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const donation = JSON.parse(params.donation);
  const [activeIndex, setActiveIndex] = useState(0);
   const navigation = useNavigation();
  
    useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
      // fetchDonations();
    }, []);

  const handleBackPress = () => {
    router.back();
  };

  const handleImageScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  const renderImageSlider = () => {
    if (!donation.images || donation.images.length === 0) {
      return (
        <View style={styles.sliderImageContainer}>
          <Ionicons name="fast-food" size={60} color={Colors.primary} />
        </View>
      );
    }

    return (
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleImageScroll}
          scrollEventThrottle={16}
          style={styles.sliderContainer}
        >
          {donation.images.map((uri, index) => (
            <Image 
              key={index} 
              source={{ uri }} 
              style={styles.sliderImage} 
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        {donation.images.length > 1 && (
          <View style={styles.pagination}>
            {donation.images.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.paginationDot,
                  index === activeIndex && styles.activeDot
                ]} 
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Head label="Donation Details" showBackOption={true} onBackPress={handleBackPress} />
      <ScrollView contentContainerStyle={styles.content}>
        {renderImageSlider()}
        
        <Text style={styles.title}>{donation.title}</Text>
        <Text style={styles.description}>{donation.description}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="pricetag" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{donation.price}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="fast-food" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>
              Quantity: {donation.quantity === 0 ? donation.customQuantity : donation.quantity}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>Pickup: {donation.pickupTime}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>Listed for: {donation.daysListed} days</Text>
          </View>
        </View>
        
        {donation.instructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Instructions</Text>
            <Text style={styles.sectionContent}>{donation.instructions}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  content: {
    paddingBottom: 20,
  },
  sliderContainer: {
    height: 250,
  },
  sliderImage: {
    width: width,
    height: 250,
  },
  sliderImageContainer: {
    width: width,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    margin: 5,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 15,
    color: Colors.dark,
  },
  description: {
    fontSize: 16,
    color: Colors.dark,
    marginHorizontal: 15,
    marginBottom: 20,
    lineHeight: 24,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.dark,
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.dark,
  },
  sectionContent: {
    fontSize: 16,
    color: Colors.dark,
    lineHeight: 24,
  },
});

export default DonationDetails;