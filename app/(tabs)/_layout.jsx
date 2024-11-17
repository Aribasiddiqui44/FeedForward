import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons, FontAwesome5, Entypo, Feather } from '@expo/vector-icons';
import {Colors} from './../../constants/Colors';
import CustomDrawer from '../../components/customTab';

export default function RecieverTabs() {
  const navigation = useNavigation();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => setIsDrawerVisible(true)} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color={Colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <>
      
      <Modal
        visible={isDrawerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDrawerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CustomDrawer onClose={() => setIsDrawerVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '65%',
    height: '100%',
    elevation: 5,
  },
});