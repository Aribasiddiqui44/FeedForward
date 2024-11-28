// app/(tabs)/profile.jsx

import React,{useEffect,useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import Head from '../../components/header';
import { useRouter,useNavigation } from 'expo-router';

export default function ProfilePage() {
    const navigation = useNavigation();
    const router= useRouter();
    useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);
  // Handler for back button
  const handleBackPress = () => {
    router.back(); // Navigate back
  };

  // Handler for edit button
  const handleEditPress = () => {
    alert('Edit profile clicked!');
  };

  return (
    <View style={styles.container}>
      {/* Custom Header with Back and Edit Options */}
      <Head 
        showBackOption={true}
        showEditOption={true}
        label='Personal Information'
        onBackPress={handleBackPress}
        onEditPress={handleEditPress}
      />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View style={styles.subTitle}>
            <Text style={styles.profileName}>Zariya Foundation</Text>
            <Text style={styles.profileEmail}>zariya@info.org</Text>
        </View>
        
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {/* Name */}
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color={Colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoText}>Zariya Foundation</Text>
          </View>
        </View>

        {/* Email */}
        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={24} color={Colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoText}>zariya@info.org</Text>
          </View>
        </View>

        {/* Contact Number */}
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={24} color={Colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Contact No</Text>
            <Text style={styles.infoText}>03072890612</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    justifyContent:'space-around',
    padding:20,
    //gap:20,
    flexDirection:'row',
    backgroundColor:Colors.primary,
    paddingVertical: 30,
    borderBottomRightRadius:20,
    borderBottomLeftRadius:20,
  },
  subTitle:{
    flexDirection:'column',
    padding:20,
    marginTop:-17
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    color:Colors.White,
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 5,
    color:Colors.White,

  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  infoTextContainer: {
    marginLeft: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    width: '80%',
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#aaa',
    marginBottom:5,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
});
