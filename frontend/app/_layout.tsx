import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native"; 
import { Colors } from "./../constants/Colors"; // Ensure correct path to Colors.ts

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true}/>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
