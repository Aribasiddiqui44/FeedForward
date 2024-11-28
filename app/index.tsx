
import React from "react";
import { Text, View } from "react-native";
import Login from './../components/Login' 
import { SafeAreaView } from "react-native-safe-area-context";
import {StatusBar} from 'expo-status-bar'
export default function Index() {
  return (
    <SafeAreaView>
      <Login/>
      <StatusBar backgroundColor='#161622' style='light'></StatusBar>
    </SafeAreaView>
  );
}
