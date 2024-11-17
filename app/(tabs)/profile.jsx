import { View, Text } from 'react-native'
import React from 'react'
import FoodCard from '../../components/foodCard'

export default function profile() {
  return (
    <View>
      <FoodCard
        foodName="Chicken Biryani"
        description="Delicious surplus biryani available..."
        total="350 PKR"
        portions="7"
        type="Paid"
        status="Pick up time:"
        statusTime="11:00 pm"
        imageSource={require('./../../assets/images/logo.png')} // Replace with your image path
      />
    </View>
  )
}