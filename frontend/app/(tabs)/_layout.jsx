import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Image, Alert
} from 'react-native';
import { Tabs, useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import Head from '../../components/header';
import apiClient from '../../utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Layout() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    // Initialize user type
    const initUserType = async () => {
      try {
        // First check route params
        if (params.userType) {
          setUserType(params.userType);
          await AsyncStorage.setItem('userType', params.userType);
          return;
        }

        // Then check AsyncStorage
        const storedUserType = await AsyncStorage.getItem('userType');
        if (storedUserType) {
          setUserType(storedUserType);
        }
      } catch (error) {
        console.error('Error initializing user type:', error);
      }
    };

    initUserType();
  }, [params.userType]);

  const logoutUser = async () => {
    try {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: async () => {
              try {
                await apiClient.post('/users/logout');
                await AsyncStorage.removeItem('userType');
                router.replace('/auth/sign-in');
              } catch (error) {
                console.error('Logout error:', error);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              }
            },
            style: 'destructive',
          },
        ]
      );
    } catch (error) {
      console.error('Error showing alert:', error);
    }
  };

  const { organizationName, organizationEmail, address, city, country, postalCode } = useLocalSearchParams();

  // Menu items for receiver navigation
  const receiverMenuItems = [
    { label: 'Restaurant Listing', icon: 'user', screen: '/(tabs)/receiver/restaurantListing' },
    { label: 'Profile', icon: 'user', screen: '/(tabs)/receiver/profile' },
    { label: 'My Orders', icon: 'shopping-bag', screen: '/receiver/myOrder' },
    { label: 'My Requests', icon: 'git-pull-request', screen: '/receiver/myRequest' },
    { label: 'My Donations', icon: 'gift', screen: '/receiver/donation' },
    { label: 'About', icon: 'info', screen: '/receiver/About' },
    { label: 'Settings', icon: 'settings', screen: '/receiver/Settings' },
    { label: 'Customer Support', icon: 'message-circle', screen: '/receiver/Support' },
    { label: 'Logout', icon: 'log-out', action: logoutUser },
  ];

  // Menu items for donor navigation
  const donorMenuItems = [
    { label: 'My Donations', icon: 'gift', screen: '/(tabs)/donor/myDonation' },
    { label: 'Profile', icon: 'user', screen: '/(tabs)/donor/profileDonor' },
    { label: 'Donation History', icon: 'clock', screen: '/donor/donationHistory' },
    { label: 'About', icon: 'info', screen: '/donor/About' },
    { label: 'Settings', icon: 'settings', screen: '/donor/Settings' },
    { label: 'Customer Support', icon: 'message-circle', screen: '/donor/Support' },
    { label: 'Logout', icon: 'log-out', action: logoutUser },
  ];

   //for volunteer
   const volunteerMenuItems = [
    { label: 'Available Orders', icon: 'list', screen: '/(tabs)/volunteer/availableOrders' },
    { label: 'Accepted Orders', icon: 'check-circle', screen: '/(tabs)/volunteer/acceptedOrders' },
    { label: 'Profile', icon: 'user', screen: '/(tabs)/volunteer/profile' },
    { label: 'About', icon: 'info', screen: '/volunteer/About' },
    { label: 'Settings', icon: 'settings', screen: '/volunteer/Settings' },
    { label: 'Support', icon: 'message-circle', screen: '/volunteer/Support' },
    { label: 'Logout', icon: 'log-out', screen: '/Login' },
  ];
  
  const menuItems =
  userType === 'donor' ? donorMenuItems :
  userType === 'receiver' ? receiverMenuItems :
  volunteerMenuItems;
 

  return (
    <View style={styles.container}>
      {/* <Head label='Feed Forward' showMenuOption={true} onMenuPress={() => setIsDrawerVisible(true)} showSearchOption={userType === 'receiver'}></Head> */}
      <Head
  label='Feed Forward'
  showMenuOption={true}
  showSearchOption={userType === 'receiver'}
  onSearchPress={() => {
  const newSearchState = params?.showSearch !== 'true';
  router.push({
    pathname: '/(tabs)/receiver/restaurantListing',
    params: { 
      showSearch: String(newSearchState),
      // Add a timestamp to force update
      refresh: Date.now().toString() 
    },
  });
}}
  onMenuPress={() => setIsDrawerVisible(true)}
/>

      {/* Bottom Tabs - Different tabs based on user type */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }}
      >
        {userType === 'donor' ? (
          // Donor tabs
          <>
            <Tabs.Screen
              name="chooseDonationScreen"
              options={{
                title: 'Choose Donation',
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
              }}
            />
          </>
        ) : userType === 'receiver' ? (
          // Receiver tabs
          <>
            <Tabs.Screen
              name="restaurantListing"
              options={{
                title: 'Restaurant_Listing',
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
              }}
            />
            <Tabs.Screen
              name="donation"
              options={{
                title: 'Donations',
              }}
            />
          </>
        ) : (
          // Volunteer tabs
          <>
            <Tabs.Screen
              name="availableOrders"
              options={{
                title: 'Available Orders',
              }}
            />
            <Tabs.Screen
              name="acceptedOrders"
              options={{
                title: 'Accepted Orders',
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
              }}
            />
          </>
        )}
      </Tabs>

      {/* Side Drawer Modal */}
      <Modal
        visible={isDrawerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDrawerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.drawerContainer}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setIsDrawerVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Drawer Header */}
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/whitelogo.png')}
                style={styles.logo}
              />
            </View>

            {/* Drawer Menu Items */}
            <ScrollView>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    setIsDrawerVisible(false);
                    router.push({
                      pathname: item.screen,
                      params: { organizationName, organizationEmail, address, city, country, postalCode, userType }
                    });
                  }}
                >
                  <Feather name={item.icon} size={24} color="#fff" />
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  feedTitle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContainer: {
    position: 'relative',
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 15,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    position: 'absolute',
    left: 15,
    top: 14,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  drawerContainer: {
    backgroundColor: Colors.primary,
    width: '70%',
    height: '100%',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: -90,
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