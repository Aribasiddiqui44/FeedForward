import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Head from '../../../components/header';
import { useRouter, useNavigation } from 'expo-router';
import { Colors } from '../../../constants/Colors';

export default function RecieverImpact() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleBackPress = () => {
    router.back(); // Navigate back
  };

  return (
    <View style={styles.container}>
      <Head
        showBackOption={true}
        label="My Impact"
        onBackPress={handleBackPress}
      />
        <View style={styles.container1}>
      {/* Impact Overview */}
      <View style={styles.impactContainer}>
        <View style={styles.impactItem}>
          <Ionicons name="fast-food-outline" size={40} color="#00aa95" style={styles.icon} />
          <Text style={styles.impactNumber}>0</Text>
          <Text style={styles.impactLabel}>Meals saved</Text>
        </View>
        <View style={styles.impactItem}>
          <Ionicons name="people-outline" size={40} color="#00aa95" style={styles.icon} />
          <Text style={styles.impactNumber}>0</Text>
          <Text style={styles.impactLabel}>People shared with</Text>
        </View>
      </View>

      {/* Call to Action */}
      <View style={styles.supporterContainer}>
        <Text style={styles.supporterText1}>
          Feels like doing more? 
        </Text>
        <Text style={styles.supporterText}>Help us achieve our mission by becoming a Feed Forward supporter.</Text>
        <TouchableOpacity style={styles.supporterButton}>
          <Ionicons name="heart" size={20} color="#fff" style={styles.heartIcon} />
          <Text style={styles.supporterButtonText}>Become a Supporter</Text>
        </TouchableOpacity>
      </View>

      {/* Goals */}
      <Text style={styles.goalsTitle}>Goals</Text>
      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>Tag It, Share It</Text>
        <View style={styles.rewardContainer}>
          <Ionicons name="star" size={20} color="#fff" />
          <Text style={styles.rewardText}>+10</Text>
        </View>
        <Text style={styles.goalDescription}>
          Clearly label your donations with dates—it helps get the right meals to the right people, fast.
        </Text>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',  // Light grey background for the whole container
    //padding: 20,
  },
  container1: {
    flex: 1,
    backgroundColor: '#f8f9fa',  // Light grey background for the whole container
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00aa95',
  },
  impactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  impactItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff', // White background for impact items
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop:15
  },
  icon: {
    marginBottom: 10,
  },
  impactNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  impactLabel: {
    fontSize: 14,
    color: '#666',
  },
  supporterContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  supporterText: {
    fontSize: 14,
    color: Colors.Grey,
    textAlign: 'center',
    marginBottom: 10,
  },
  supporterText1: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight:500
  },
  supporterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00aa95',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  heartIcon: {
    marginRight: 10,
  },
  supporterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  goalCard: {
    backgroundColor: '#f0f4ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: '#ffd700',
    borderRadius: 20,
    padding: 5,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
