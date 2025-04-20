import { View, Text, StyleSheet, FlatList, ScrollView, SafeAreaView,Image } from 'react-native';
import React from 'react';
import RestaurantCard from '../../components/restaurantCard';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

const restaurantData = [
  {
    id: 1,
    name: 'Haveli Restaurant',
    distance: 1,
    time: '10:00 PM',
    foodItems: [
      { id: 1, name: 'Chicken Biryani', quantity: 10, price: 50, description: 'A delicious chicken biryani.',rest_image:'./../../assets/images/bir.png' },
      { id: 2, name: 'Tandoori Naan', quantity: 20, price: 70, description: 'A soft tandoori naan.',rest_image:'./../../assets/images/yum.png' },
    ],
  },
  {
    id: 2,
        name: 'BarBQ Tonight',
    distance: 1,
    time: '11:00 PM',
    foodItems: [
      { id: 1, name: 'Chicken Karahi', quantity: 25, price: 60, description: 'Spicy chicken karahi.',
        rest_image:'./../../assets/images/yum.png'
       },
      { id: 2, name: 'Fried Fish', quantity: 15, price: 30, description: 'Crispy fried fish.',
        rest_image:'./../../assets/images/friedFish.jpg'
       },
    ],
  },
  {
    id: 3,
    //rest_image:'./../../assets/images/biryaniPng.png',
    name: 'BarBQ Tonight',
    distance: 1,
    time: '11:00 PM',
    foodItems: [
      { id: 1, name: 'Chicken Karahi', quantity: 25, price: 60, description: 'Spicy chicken karahi.',
        rest_image:'./../../assets/images/bir.png'
       },
      { id: 2, name: 'Fried Fish', quantity: 15, price: 30, description: 'Crispy fried fish.',
        rest_image:'./../../assets/images/friedFish.jpg',
       },
    ],
  },
  {
    id: 4,
    name: 'BarBQ Tonight',
    distance: 1,
    time: '11:00 PM',
    foodItems: [
      { id: 1, name: 'Chicken Karahi', quantity: 25, price: 60, description: 'Spicy chicken karahi.',
        rest_image:'./../../assets/images/biryaniPng.png'
       },
      { id: 2, name: 'Fried Fish', quantity: 15, price: 30, description: 'Crispy fried fish.',
        rest_image:'./../../assets/images/friedFish.jpg'
       },
    ],
  },
];

export default function RestaurantListing() {
  const router = useRouter();

  const handleFoodItemPress = (foodItems, restaurant) => {
    router.push({
      pathname:'./FoodDetails',
      params:{
        restId: String(restaurant.id),
        rest_name: restaurant.name,
        rest_time:restaurant.time,
        rest_dist:String(restaurant.distance),
        restImage:foodItems.rest_image,
        foodId: String(foodItems.id),
        foodName: foodItems.name,
        foodPrice: foodItems.price,
        foodDescription: foodItems.description,
        foodQuantity:foodItems.quantity,
        }
    });
  };
  

  return (
      <View style={styles.container}>
        
        <FlatList
          data={restaurantData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onFoodItemPress={(foodItem) => handleFoodItemPress(foodItem, item)}
            />
          )}
          ListHeaderComponent={() => (
            <View style={styles.row}>
              <View style={styles.line} />
              <Text style={styles.text}>Offers in the current map area</Text>
              <View style={styles.line} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  line: {
    height: 1,
    backgroundColor: Colors.Grey,
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 10,
  },
});
