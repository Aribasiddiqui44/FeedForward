import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export default function RestaurantCard({ restaurant, onFoodItemPress }) {
    return (
        <View style={styles.card}>
            {/* Restaurant Header */}
            <View style={styles.header}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.distance}>{restaurant.distance} Km</Text>
                <Text style={styles.time}>{restaurant.time}</Text>
            </View>

            {/* Food Items List */}
            <FlatList
                data={restaurant.foodItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onFoodItemPress(item)}>
                        <View style={styles.foodRow}>
                            <Text style={styles.foodName}>{item.name}</Text>
                            <View style={styles.quantityRow}>
                                <Ionicons name="restaurant-outline" size={14} color="#999" />
                                <Text style={styles.quantity}>{item.quantity}</Text>
                            </View>
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>{item.price} pkr</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#d6f5f2',
        borderRadius: 6,
        padding: 8,
        marginBottom: 10,
    },
    restaurantName: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#42b0aa',
    },
    distance: {
        fontSize: 12,
        color: '#777',
    },
    time: {
        fontSize: 12,
        color: '#777',
    },
    foodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    foodName: {
        flex: 2,
        fontSize: 14,
        color: '#333',
    },
    quantityRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantity: {
        fontSize: 14,
        color: '#777',
        marginLeft: 4,
    },
    priceContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: 500,
        backgroundColor: '#d6f5f2',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5,
    },
});
