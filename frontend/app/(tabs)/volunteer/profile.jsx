import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter,useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../constants/Colors';

export default function Profile() {
  const { organizationName, organizationEmail, address, city, country, postalCode } = useLocalSearchParams();
  const navigation = useNavigation();
  const router= useRouter();

  return (
    
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} 
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>Johndoe@gmail.com</Text>
      </View>

      {/* Navigation Options */}
      <View style={styles.navOptions}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/volunteer/profileOverview')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.navText}>Personal Info</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('Address')}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="location-on" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.navText}>Address</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/volunteer/impact')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="stats-chart-outline" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.navText}>My Impact</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Messages')}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="email" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.navText}>Messages</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 30,
    borderBottomRightRadius:20,
    borderBottomLeftRadius:20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#fff',
  },
  profileEmail: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  navOptions: {
    marginTop: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  navText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
