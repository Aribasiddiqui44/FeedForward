import { View, Text, Image, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { Colors } from './../../../constants/Colors.ts';
import { useNavigation, useRouter } from 'expo-router';
import { TextInput } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { StatusBar } from 'react-native';
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
      <View style={styles.up}>
        <Image 
            source={require('./../../../assets/images/whitelogo.png')}
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
          <Text style={styles.description}>Log Into Your Account</Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput 
            style={styles.input_text} 
            placeholder='Enter Email' 
            placeholderTextColor={Colors.Grey} 
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput 
            secureTextEntry={true} 
            style={styles.input_text} 
            placeholder='Enter Password' 
            placeholderTextColor={Colors.Grey}
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={()=>router.push('/accessLocation/AccessLocation')}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity style={styles.createAccountButton} onPress={()=>router.push('/role_selection')}>

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
  up:{
    backgroundColor:Colors.primary,
    height:'35%',
    alignItems:'center',
    justifyContent:'center'
    // marginTop:35
    
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, 
    height:'100%'
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
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
    textAlign: 'center',
    color: Colors.primary,
    marginBottom: 10,
  
  },
  description: {
    fontSize: 25,
    textAlign: 'center',
    color: Colors.Grey,
    lineHeight: 32,
    
  },
  iconContainer: {
    position: 'absolute',
    top: 34,
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
    marginBottom: 7,
  },
  input_text: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.primary,
    backgroundColor: Colors.LightGrey,
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
    fontSize: 18,
  },
});

