import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export default function Head({ 
  showMenuOption = false, 
  showBackOption = false, 
  showEditOption = false, 
  showSearchOption = false, 
  label = '', 
  onBackPress, 
  onEditPress, 
  onSearchPress ,
  onMenuPress
}) {
  return (
    <View style={styles.headerContainer}>
      {/* Back Button */}
      {showBackOption && (
        <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Menu Button */}
      {showMenuOption && (
        <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Header Label */}
      <Text style={styles.headerTitle}>{label}</Text>

      {/* Edit Button */}
      {showEditOption && (
        <TouchableOpacity onPress={onEditPress} style={styles.iconButton}>
          <Feather name="edit-2" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Search Button */}
      {showSearchOption && (
        <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      

    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  iconButton: {
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
});
