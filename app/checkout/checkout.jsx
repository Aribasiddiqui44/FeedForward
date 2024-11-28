import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import Head from '../../components/header';
import { Colors } from '../../constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView } from 'react-native';
export default function checkout() {
  const searchParams = useLocalSearchParams();
  const { foodName, foodPrice, rest_time, selectedQuantity,rest_name } = searchParams;
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

  return (
    <View style={styles.container}>
      <Head 
        showBackOption={true}
        label="Checkout"
        onBackPress={handleBackPress}
      />
    <ScrollView>
      {/* Food Details */}
      <View style={styles.foodDetails}>
        <Image source={require('./../../assets/images/greenLogo.png')} style={styles.image}/>
        <Text style={styles.foodName}>{foodName}</Text>
        
        </View>
        <View style={styles.det}>
            <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#000" />
            <Text style={styles.portionsText}>Restaurant:</Text>
            </View>
            <View>
            <Text style={styles.pickupTimeText}>{rest_name}</Text>
            </View>
        
      </View>
        <View style={styles.det}>
            <View style={styles.infoRow}>
            <Ionicons name="restaurant-outline" size={18} color="#000" />
            <Text style={styles.portionsText}>{selectedQuantity} portions</Text>
            </View>
            <View>
            <Text style={styles.pickupTimeText}>{foodPrice * selectedQuantity} PKR</Text>
            </View>
        
      </View>
        <View style={styles.det}>
        <View style={[styles.infoRow, styles.pickupRow]}>
        <Ionicons name="time-outline" size={18} color="#000000" />
        <Text style={styles.portionsText}>Pickup Time: </Text>
      </View>
      <View>
       <Text style={styles.pickupTimeText}> {rest_time}</Text>
      </View>

        </View>

      {/* Payment Options */}
      
      <View style={styles.paymentContainer}>
      
      <View style={styles.pay}><Text style={styles.paymentHeader}>Select Payment Method</Text></View>
      
        <View style={styles.paymentOpt}>
        <TouchableOpacity style={styles.paymentOption} onPress={()=>router.push({
            pathname:'./../orderReceipt/OrderSuccess',
            params:{
                foodName, foodPrice, rest_time, selectedQuantity,rest_name
            },
        }
            )}>
        <View style={styles.forward}>
          <Ionicons name="card-outline" size={20} color="#000" />
          <Text style={styles.paymentText}>Credit/Debit Card</Text>
        </View>
        <View><MaterialIcons name="arrow-forward-ios" size={20} color="#555" /></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.forward}>
                <Ionicons name="cash-outline" size={20} color="#000" />
                <Text style={styles.paymentText}>Bank Account</Text>
          </View>
          <View><MaterialIcons name="arrow-forward-ios" size={20} color="#555" /></View>

        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption} onPress={()=>router.push({
            pathname:'./../orderReceipt/OrderSuccess',
            params:{
                foodName, foodPrice, rest_time, selectedQuantity,rest_name
            },
        }
            )}>
            <View style={styles.forward}>
                <Ionicons name="wallet-outline" size={20} color="#000" />
                <Text style={styles.paymentText}>Cash On Pickup</Text>
            </View>
          <View><MaterialIcons name="arrow-forward-ios" size={20} color="#555" /></View>
          
          
        </TouchableOpacity>
        </View>
       
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //paddingHorizontal: 16,
    //paddingTop: 20,
  },
  pay:{
    alignItems:'center',
    justifyContent:'center',
    padding:9,
    backgroundColor:Colors.primary,
    borderRadius:20,
    resizeMode:'contain'
  },
  forward:{
    flexDirection:'row',
    justifyContent:"space-between"
  },
  det:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    shadowColor: "#000", 
  shadowOffset: {
    width: 0, 
    height: 1, 
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2, 
  backgroundColor: "#fff", 
  borderRadius: 8, 
  padding: 8, 
  marginHorizontal: 16, 
  marginVertical: 4, 
  },
  image: {
    width: 200,
    height: 170,
    resizeMode: 'cover',
  },
  foodDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 400,
    color: '#333',
    //marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  portionsText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight:500,
    marginLeft: 8,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    //marginTop: 10,
  },
  pickupRow: {
    justifyContent: 'center',
  },
  pickupTimeText: {
    fontSize: 16,
    color: '#888',
    marginLeft: 8,
    fontWeight:500,

  },
  paymentContainer: {
    marginTop: 20,
    margin:20,
    backgroundColor: '#f6f6f6',
    //padding: 15,
    borderRadius: 10,
  },
  paymentOpt:{
    padding:15,
  },
  paymentHeader: {
    fontSize: 18,
    fontWeight: '450',
    color: Colors.White,
   
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding:9,
    marginBottom:17,
  },
  paymentText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 12,
  },
});
