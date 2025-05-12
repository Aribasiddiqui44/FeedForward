import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function OnBoardThree() {
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

  const handleNextPress = () => safeNavigate('auth/sign-in');

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={require('./../../assets/images/on3.png')}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel="Food donation notifications illustration"
        />
      </View>

      <Text style={styles.quoteText}>
        {'\n'}
        <Text style={styles.highlight}>
          Stay Updated with Nearby Offers {'\n'}
        </Text>
        Get notified about food donation offers near you! Stay informed on available donations from local restaurants and businesses, making it easier to act fast and help your community.
      </Text>

      <View style={styles.paginationContainer} accessibilityRole="tablist">
        <View 
          style={[styles.dot, { backgroundColor: '#d4f7f1' }]} 
          accessibilityRole="tab"
          accessibilityLabel="Step 1"
        />
        <View 
          style={[styles.dot, { backgroundColor: '#d4f7f1' }]} 
          accessibilityRole="tab"
          accessibilityLabel="Step2"
        />
        <View 
          style={[styles.dot, { backgroundColor: '#d4f7f1' }]} 
          accessibilityRole="tab"
          accessibilityLabel="Step 3"
        />
        <View 
          style={[styles.dot, { backgroundColor: '#00aa95' }]} 
          accessibilityRole="tab"
          accessibilityLabel="Current step"
        />
      </View>

      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={handleNextPress}
        accessibilityRole="button"
        accessibilityLabel="Next"
      >
        <Text style={styles.nextButtonText}>Next</Text>
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
    height: '40%',
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