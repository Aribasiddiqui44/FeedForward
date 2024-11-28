import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import Head from '../../components/header';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';

export default function AccessLocation() {
  const navigation = useNavigation();
  const router = useRouter();
  const { role } = useLocalSearchParams(); 

  const [loading, setLoading] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleLocationFetch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Navigate based on the role
      if (role === 'donor') {
        router.push('./../donor/donorForm'); // Navigate to donor form
      } else if (role === 'receiver') {
        router.push('./../reciever/recieverForm/'); // Navigate to receiver form
      } else {
        router.push('/volunteer/volunteerForm'); // Navigate to volunteer form
      }
    }, 2000); // Simulate location fetching delay
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={styles.headContainer}>
      {/* Header */}
      <Head label="Feed Forward" showBackOption={true} onBackPress={handleBackPress} />

      {/* Container */}
      <View style={styles.container}>
        {/* Background Map Image */}
        <Image
          source={require('./../../assets/images/map.png')}
          style={styles.mapImage}
          resizeMode="cover"
        />

        {/* Overlay Content */}
        <View style={styles.overlay}>
          {/* Search Box */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your address..."
              placeholderTextColor={Colors.Grey}
            />
            <TouchableOpacity style={styles.searchIcon}>
              <AntDesign name="search1" size={20} color={Colors.White} />
            </TouchableOpacity>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleLocationFetch}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={Colors.White} />
            ) : (
              <Text style={styles.locationButtonText}>Use your current location</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headContainer: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  container: {
    flex: 1,
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.White,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.Black,
  },
  searchIcon: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    opacity: 1,
  },
  locationButtonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
