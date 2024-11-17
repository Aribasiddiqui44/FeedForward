import { View, Text, Image, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { Colors } from './../../../constants/Colors.ts';
import { useNavigation, useRouter } from 'expo-router';
import { TextInput } from 'react-native-web';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SignIn() {
  const navigation = useNavigation();
    const router=useRouter();
  // Disable the header for this screen
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

      {/* Background Image */}
      <View>

        <Image 
            source={require('./../../../assets/images/Land.jpg')}
            style={styles.image}
        />
        <TouchableOpacity 
                style={styles.iconContainer}
                onPress={() => router.back()} 
            >
                <AntDesign name="leftcircleo" size={32} color="white" />
        </TouchableOpacity>
        </View>

      <View style={styles.container}>
        {/* App Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Feed Forward</Text>
          <Text style={styles.description}>Let's Sign You In</Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder='Enter Email' 
            placeholderTextColor={Colors.Grey} 
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput 
            secureTextEntry={true} 
            style={styles.input} 
            placeholder='Enter Password' 
            placeholderTextColor={Colors.Grey}
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={()=>router.replace('./../../role_selection')}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity style={styles.createAccountButton} onPress={()=>router.replace('auth/sign-up')}>

          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // To ensure the content doesn't get cut off at the bottom
    height:'100%'
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  container: {
    backgroundColor: Colors.White,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 10,
    height: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    color: Colors.primary,
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    color: Colors.Grey,
    lineHeight: 22,
  },
  iconContainer: {
    position: 'absolute',
    top: 23,
    left: 20,
    zIndex: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 8,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.primary,
    backgroundColor: Colors.LightGrey,
    fontFamily: 'Times New Roman',
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  signInButtonText: {
    color: Colors.White,
    fontFamily: 'Times New Roman',
    fontSize: 18,
  },
  createAccountButton: {
    backgroundColor: Colors.White,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountButtonText: {
    color: Colors.primary,
    fontFamily: 'Times New Roman',
    fontSize: 18,
  },
});

