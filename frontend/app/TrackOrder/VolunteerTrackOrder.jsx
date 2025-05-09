import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Head from '../../components/header';
import { Colors } from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const deliveryStages = [
  'To be picked',
  'Left Restaurant',
  'On the Way',
  'Delivered',
];

export default function AcceptedTrackOrder() {
  const navigation = useNavigation();
  const router = useRouter();

  const searchParams = useLocalSearchParams();
  const {
    foodName,
    date,
    portions,
    statusTime,
    total,
    orderFrom,
    deliverTo,
    imageSource,
    deliveryStatus,
  } = searchParams;

  const [currentStageIndex, setCurrentStageIndex] = useState(
    deliveryStages.indexOf(deliveryStatus) || 0
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const updateOrderStatus = async (newStageIndex) => {
    const updatedOrder = {
      foodName,
      date,
      portions,
      statusTime,
      total,
      orderFrom,
      deliverTo,
      imageSource,
      deliveryStatus: deliveryStages[newStageIndex],
    };

    try {
      const confirmedOrders = JSON.parse(await AsyncStorage.getItem('confirmedOrders')) || [];
      const orderIndex = confirmedOrders.findIndex((order) => order.foodName === foodName);
      if (orderIndex > -1) {
        confirmedOrders[orderIndex] = updatedOrder; // Update the order with the new status
        await AsyncStorage.setItem('confirmedOrders', JSON.stringify(confirmedOrders));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleNextStage = () => {
    if (currentStageIndex < deliveryStages.length - 1) {
      const newStageIndex = currentStageIndex + 1;
      setCurrentStageIndex(newStageIndex);
      updateOrderStatus(newStageIndex);
    }
  };

  return (
    <>
      <Head showBackOption={true} label="Track Order" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={imageSource} style={styles.foodImage} />
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.detailsBox}>
            <Text style={styles.detail}>
              <Text style={styles.label}>Donor: </Text>
              {orderFrom}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Receiver: </Text>
              {deliverTo}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Portions: </Text>
              {portions}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Pick-up time: </Text>
              {statusTime}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Total: </Text>
              {total}
            </Text>
          </View>

          {/* Delivery Stage Progression */}
          <View style={styles.statusBox}>
            <Text style={styles.statusHeading}>Delivery Status</Text>
            {deliveryStages.map((stage, index) => (
              <Text
                key={index}
                style={[
                  styles.statusItem,
                  index === currentStageIndex && styles.currentStatus,
                  index < currentStageIndex && styles.completedStatus,
                ]}
              >
                {stage}
              </Text>
            ))}

            {currentStageIndex < deliveryStages.length - 1 && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextStage}
              >
                <Text style={styles.nextButtonText}>Next Stage</Text>
              </TouchableOpacity>
            )}

            {currentStageIndex === deliveryStages.length - 1 && (
              <Text style={styles.deliveredText}>✅ Order Delivered</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 18,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Colors.primary,
    height: 210,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 18,
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.White,
  },
  date: {
    fontSize: 14,
    color: Colors.White,
    marginTop: 5,
  },
  detailsBox: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  detail: {
    fontSize: 14,
    marginVertical: 5,
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  statusBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00b894',
  },
  statusItem: {
    fontSize: 14,
    paddingVertical: 5,
    color: '#777',
  },
  currentStatus: {
    color: '#00b894',
    fontWeight: 'bold',
  },
  completedStatus: {
    color: '#808080',
    textDecorationLine: 'line-through',
  },
  nextButton: {
    marginTop: 15,
    backgroundColor: '#00b894',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deliveredText: {
    marginTop: 15,
    fontSize: 16,
    color: '#4caf50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});