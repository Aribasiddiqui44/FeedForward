import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const FILTERS = ['Best Match', 'Price', 'Meals Count', 'Distance'];

const SearchModal = ({ visible, onClose, onApplyFilters, allDonations }) => {
  const [activeFilter, setActiveFilter] = useState('Best Match');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mealsCount, setMealsCount] = useState('');
  const [maxDistance, setMaxDistance] = useState('');

  const applyFilters = () => {
    let filtered = [...allDonations];

    if (activeFilter === 'Price') {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      filtered = filtered.filter(item => {
        const price = item.donationUnitPrice?.value || 0;
        return price >= min && price <= max;
      });
    }

    if (activeFilter === 'Meals Count') {
      const count = parseInt(mealsCount) || 0;
      filtered = filtered.filter(item => item.donationQuantity?.quantity >= count);
    }

    if (activeFilter === 'Distance') {
      const dist = parseFloat(maxDistance) || Infinity;
      filtered = filtered.filter(item => item.distance <= dist); // assuming distance in km
    }
    console.log('All donations:', allDonations.length);
console.log('Filtered results:', filtered.length);
    onApplyFilters(filtered);
    onClose();
  };

  const renderFilterInput = () => {
    switch (activeFilter) {
      case 'Price':
        return (
          <View style={styles.priceContainer}>
            <TextInput
              style={styles.input}
              placeholder="Min"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <Text style={{ marginHorizontal: 5 }}>-</Text>
            <TextInput
              style={styles.input}
              placeholder="Max"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>
        );
      case 'Meals Count':
        return (
          <TextInput
            style={styles.input}
            placeholder="Meals Count"
            keyboardType="numeric"
            value={mealsCount}
            onChangeText={setMealsCount}
          />
        );
      case 'Distance':
        return (
          <TextInput
            style={styles.input}
            placeholder="Max Distance (km)"
            keyboardType="numeric"
            value={maxDistance}
            onChangeText={setMaxDistance}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput placeholder="Search for food items" style={styles.searchInput} />
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-circle" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterTabs}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginVertical: 10 }}>{renderFilterInput()}</View>

        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyText}>Apply Filter</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: 8,
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
    margin: 5,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: '#333',
  },
  activeFilterText: {
    color: 'white',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderColor: Colors.Grey,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
    fontSize: 16,
  },
});
