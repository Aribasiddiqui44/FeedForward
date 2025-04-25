import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import Head from '../../../components/header';
import { useEffect} from 'react';

export const options = {
  headerShown: false,
};

export default function ChooseDonation () {
  const router = useRouter();
  const { userType, organizationName } = useLocalSearchParams();
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({
    headerShown: false,
    });
  }, []);

  return (
    <View style={styles.headContainer}>
    <Head label='Feed Forward' showMenuOption={true} showSearchOption={false} />
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.contentContainer}>  
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => router.push({
                      pathname: '/donor/Donations/makeDonation',
                      params: { userType, organizationName }
                  })}
                  >
                  <Text style={styles.optionText}>Make Donation</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => router.push({
                      pathname: '/donor/myDonations',
                      params: { userType, organizationName }
                  })}
                  >
                  <Text style={styles.optionText}>My Donations</Text>
                </TouchableOpacity>
            </View>
          </View>
      </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  headContainer: {
    flex: 1,
    backgroundColor: Colors.LightGrey,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.LightGrey,
  },
  contentContainer: {
    padding: 20,
  },
  optionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  optionText: {
    color: "#ffff",
    fontSize: 16,
    fontWeight: 'bold',
    padding: 15,
  },
});