import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from './../constants/Colors.ts';
import { useRouter } from 'expo-router';

export default function Login() {
    const router=useRouter();
  return (
    <View style={styles.mainContainer}>
      <Image 
        source={require('./../assets/images/Land.jpg')}
        style={styles.image}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Feed Forward</Text>
        
        <Text style={styles.description}>
          Empowering restaurants, charities, and communities to fight food waste by transforming surplus food into shared meals. Discover, donate, purchase, and volunteer seamlessly through our platform.
        </Text>
        
        <TouchableOpacity style={styles.button}
            onPress={()=>router.push('auth/sign-in')}
        
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  image: {
    width: '100%',
    height: 350,
  },
  container: {
    backgroundColor: Colors.White,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    height:'100%'
  },
  title: {
    fontSize: 36,
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    color: Colors.primary,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    color: Colors.Grey,
    lineHeight: 24,
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
    fontFamily: 'Times New Roman',
    fontSize: 18,
  }
});
