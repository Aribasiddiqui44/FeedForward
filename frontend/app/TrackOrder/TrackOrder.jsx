import { useLocalSearchParams,useNavigation,useRouter } from "expo-router";
import React,{useEffect,useState} from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import Head from "../../components/header";
import { Colors } from "../../constants/Colors";
export default function TrackOrder({  }) {
    const navigation = useNavigation();
  const router = useRouter();

  // Disable the header for this screen
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleBackPress = () => {
    router.back(); // Navigate back
  };
    const searchParams=useLocalSearchParams();
  const {
    foodName,
    date,
    donor,
    receiver,
    portions,
    statusTime,
    total,
    distance,
    orderFrom,
    deliverTo,
    imageSource,
  } = searchParams;

  return (
    <>
        <Head 
        showBackOption={true}
        label="Track Order"
        onBackPress={handleBackPress}
      />
    
    <ScrollView contentContainerStyle={styles.container}>
      {/* Food Image and Title */}
      <View style={styles.header}>
        <Image source={imageSource} style={styles.foodImage} />
        <Text style={styles.foodName}>{foodName}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Details Box */}
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
        <Text style={styles.detail}>
          <Text style={styles.label}>Distance: </Text>
          {distance}
        </Text>
      </View>

      {/* Location Information */}
      <View style={styles.locationBox}>
        <Text style={styles.locationLabel}>📍 Order from</Text>
        <Text style={styles.location}>{orderFrom}</Text>
        <Text style={styles.locationLabel}>📍 Deliver to</Text>
        <Text style={styles.location}>{deliverTo}</Text>
      </View>

      {/* Show Receipt Button */}
      <TouchableOpacity style={styles.button} onPress={()=>router.push('./../orderReceipt/OrderReceipt')}>
        <Text style={styles.buttonText}>Show Receipt</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    //padding: 20,
    backgroundColor: "#f8f9fa",
  },
  contentContainer:{
    padding:18,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor:Colors.primary,
    height:210,
    borderBottomEndRadius:20,
    borderBottomStartRadius:20,
    padding:18
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 20,
    fontWeight: "bold",
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
    backgroundColor: "#fff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  detail: {
    fontSize: 14,
    marginVertical: 5,
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  locationBox: {
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#00b894",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
