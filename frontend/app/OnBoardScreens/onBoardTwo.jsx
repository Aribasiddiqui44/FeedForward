import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function onBoardTwo() {
  const router = useRouter();
  const navigation = useNavigation();

  
    // Safe navigation handling
    const safeNavigate = (path) => {
      if (router) {
        router.push(path);
      }
    };
  
    // Handle header visibility safely
    useEffect(() => {
      if (!navigation?.setOptions) return;
  
      navigation.setOptions({ headerShown: false });
  
      return () => {
        if (navigation?.setOptions) {
          navigation.setOptions({ headerShown: true });
        }
      };
    }, [navigation]);
  
    const handleNextPress = () => safeNavigate('./onBoardFour');
    const handleSkipPress = () => safeNavigate('auth/sign-in');
  

  return (
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require('./../../assets/images/on2.png')} 
          style={styles.image}
        />
      </View>

      {/* Text Section */}
      <Text style={styles.quoteText}>
        {'\n'}<Text style={styles.highlight}>Affordable Food for Organizations</Text>{'\n'}
        Organizations can order desired number of portions at lower prices—or even for free—from nearby restaurants, cafes, and factories. 
      </Text>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        <View style={[styles.dot, { backgroundColor: '#00aa95' }]} />
        <View style={[styles.dot, { backgroundColor: '#d4f7f1' }]} />
        <View style={[styles.dot, { backgroundColor: '#d4f7f1' }]} />
        <View style={[styles.dot, { backgroundColor: '#d4f7f1' }]} />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>NEXT</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSkipPress}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: '100%',
    height:'40%',
    alignItems: 'center',
    marginTop: 50,
  },
  image: {
    width: 307,
    height: '100%',
    borderRadius: 15,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#333',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  highlight: {
    fontWeight: '600',
    color: Colors.primary,
    fontSize: 18,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  skipText: {
    fontSize: 14,
    color: '#00aa95',
    marginTop: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
