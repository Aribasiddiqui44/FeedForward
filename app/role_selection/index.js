import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { Colors } from './../../constants/Colors.ts';
import { useRouter } from 'expo-router';
export default function RoleSelection() {
  const navigation = useNavigation();
  const router= useRouter();
  // Disable the header for this screen
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.overallHead}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Feed Forward</Text>
           </View>
            <Text style={styles.subTitle}>Become a Feed Forward</Text>
        </View>
      
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.replace('Donor')}>
        <Text style={styles.buttonText}>DONOR</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.replace('./../reciever/recieverForm')}>
        <Text style={styles.buttonText}>RECEIVER</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.replace('Volunteer')}>
        <Text style={styles.buttonText}>VOLUNTEER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightGrey, 
  },
  overallHead:{
    alignItems:'center'

  },
  header: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
   
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitle: {
    marginVertical: 30,
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
    
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    margin:'15%',
    width:'70%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
