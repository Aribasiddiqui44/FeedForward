// components/CustomDrawer.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialIcons,Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import {profile} from '../app/(tabs)/profile';
export default function CustomDrawer({ onClose }) {
    const router= useRouter();
  const handleNavigation = (screen) => {
    onClose(); // Close the drawer
    router.push(screen); // Navigate to the desired screen
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Close Button */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Drawer Header */}
      <View style={styles.header}>

        <Image source={require('./../assets/images/whitelogo.png')} style={styles.logo}/>
      </View>

      <ScrollView>
        {/* Drawer Menu Items */}
        {[
          { label: 'My Profile', icon: 'user', screen: '/profile' },
          { label: 'My Orders', icon: 'shopping-bag', screen: '/discount' },
          { label: 'My Requests', icon: 'git-pull-request', screen: '/myRequest' },
          { label: 'My Donations', icon: 'gift', screen: '/donation' },
          { label: 'About', icon: 'info', screen: '/About' },
          { label: 'Settings', icon: 'settings', screen: '/Settings' },
          { label: 'Customer Support', icon: 'message-circle', screen: '/Support' },
          { label: 'Logout', icon: 'log-out', screen: '/Login' }
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleNavigation(item.screen)}
          >
            <Feather name={item.icon} size={24} color="#fff" />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingHorizontal: 20,
    
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop:-30,
  },
  header: {
    
    marginBottom: -20,
    marginTop:-90,
    marginLeft:-10,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain', // Adjust the size without stretching
    marginTop: 10,
  },
  
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    color: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 20,
  },
});
