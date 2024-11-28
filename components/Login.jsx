import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from './../constants/Colors.ts';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login({ imageResizeMode = 'cover' }) { 
  const router = useRouter();

  return (
    <SafeAreaView>
    <View style={styles.mainContainer}>
      <View style={styles.imgContainer}>
        <Image
          source={require('./../assets/images/whitelogo.png')}
          style={styles.image_head}
          resizeMode={imageResizeMode} 
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.description}>
          Empowering restaurants, charities, and communities to fight food waste by transforming surplus food into shared meals. Discover, donate, purchase, and volunteer seamlessly through our platform.
        </Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('OnBoardScreens/onBoardOne')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    //flex: 1,
    flexDirection:'column',
    backgroundColor: Colors.LightGrey,
  },
  imgContainer: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: Colors.primary,
  },
  image_head: {
    width: '100%',
    height: 200,
  },
  container: {
    backgroundColor: Colors.White,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    height: '100%',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.Grey,
    lineHeight: 30,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 18,
  },
});
