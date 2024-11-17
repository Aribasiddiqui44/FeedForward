import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function FoodCard({
  foodName = "Food Name",
  description = "Delicious food description...",
  total = "0 PKR",
  portions = "0",
  type = "Paid", // Options: "Paid", "Free"
  status = "Pick up time: 00:00 am", // Examples: "Pick up time", "Picked at", "Request Pending", "Request Rejected"
  statusTime = "",
  imageSource,
}) {
  return (
    <View style={styles.cardContainer}>
      {/* Left Section with Image */}
      <Image source={imageSource} style={styles.foodImage} />

      {/* Right Section */}
      <View style={styles.detailsContainer}>
        {/* Food Name and Type */}
        <View style={styles.header}>
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={[styles.type, type === "Free" && styles.freeType]}>{type}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>

        {/* Total and Portions */}
        <View style={styles.row}>
          <Text style={styles.total}>Total: {total}</Text>
          <Text style={styles.portions}>Portions: {portions}</Text>
        </View>

        {/* Status */}
        <Text style={styles.status}>
          {status} {statusTime && <Text>{statusTime}</Text>}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 3, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  type: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#009688', // Default color for "Paid"
  },
  freeType: {
    color: '#4CAF50', // Different color for "Free"
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  total: {
    fontSize: 12,
    color: '#333',
  },
  portions: {
    fontSize: 12,
    color: '#333',
  },
  status: {
    fontSize: 12,
    color: '#009688', // Green for statuses like "Pick up time"
    marginTop: 5,
  },
});
