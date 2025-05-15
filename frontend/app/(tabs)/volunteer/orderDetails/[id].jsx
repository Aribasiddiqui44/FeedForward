import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../constants/Colors';

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>New Order</Text>
      </View>

      <View style={styles.foodContainer}>
        <Image source={params.foodPic} style={styles.foodImage} />
        <Text style={styles.foodName}>{params.foodName}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Ionicons name="pricetag" size={20} color={Colors.primary} />
        <Text style={styles.detailText}>Price: {params.price}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Ionicons name="fast-food" size={20} color={Colors.primary} />
        <Text style={styles.detailText}>Portion: {params.portions || '7'}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Ionicons name="time" size={20} color={Colors.primary} />
        <Text style={styles.detailText}>Pick up time: {params.pickupTime}</Text>
      </View>

      <View style={styles.locationSection}>
        <Text style={styles.sectionTitle}>Pickup Location</Text>
        <View style={styles.locationCard}>
          <Ionicons name="restaurant" size={20} color={Colors.primary} />
          <Text style={styles.locationText}>{params.donorName} - {params.donorAddress}</Text>
        </View>
      </View>

      <View style={styles.locationSection}>
        <Text style={styles.sectionTitle}>Drop-off Location</Text>
        <View style={styles.locationCard}>
          <Ionicons name="location" size={20} color={Colors.primary} />
          <Text style={styles.locationText}>{params.receiverAddress}</Text>
        </View>
        <Text style={styles.distanceText}>17 mins</Text>
      </View>
     <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.acceptButton}>
        <Text style={styles.buttonText}>Accept Order</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.declineButton}>
        <Text style={styles.decbuttonText}>Decline Order</Text>
      </TouchableOpacity>
     </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  foodContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: Colors.dark,
    marginLeft: 10,
  },
  sectionTitle: {
    paddingVertical: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 10,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.dark,
    marginLeft: 10,
    flex: 1,
  },
  distanceText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 5,
    textAlign: 'right',
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.White,
  },
  decbuttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.danger,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 5,
    alignItems: 'center',
    marginTop: 20
  },
  declineButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    marginLeft: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    marginTop: 20
  },
});