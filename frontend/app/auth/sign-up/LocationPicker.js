// // LocationPicker.js
// import React, { useState, useEffect, useRef } from 'react';
// import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
// import MapView from 'react-native-maps';
// import * as Location from 'expo-location';
// import { MaterialIcons } from '@expo/vector-icons';
// import { router, useNavigation } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// export default function LocationPicker({ route }) {
//   const [region, setRegion] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const mapRef = useRef(null);
//   const navigation = useNavigation();
//   const { role } = useLocalSearchParams();

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Permission denied');
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({});
//       const initialRegion = {
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       };
//       setRegion(initialRegion);
//     })();
//   }, []);

//   const handleRegionChangeComplete = async (reg) => {
//     try {
//       const addressArr = await Location.reverseGeocodeAsync({
//         latitude: reg.latitude,
//         longitude: reg.longitude,
//       });

//       const address = addressArr[0];
//     //   console.log(address)
//       const title = `${address.name || address.street}, ${address.city || address.region}`;
//       const description = `${address.street || ''} ${address.postalCode || ''}, ${address.country}`;
//     //   console.log(address.subregion)
//     //   console.log(reg);
//       setSelectedLocation({
//         latitude: reg.latitude,
//         longitude: reg.longitude,
//         title,
//         description,
//         address: address.formattedAddress,
//         latitudeDelta: reg.latitudeDelta,
//         longitudeDelta: reg.longitudeDelta,
//         subregion: address.subregion
//       });
//     } catch (err) {
//       console.error('Reverse geocode error:', err);
//     }
//   };

//   const handleConfirmLocation = () => {
//     if (selectedLocation) {
//     //   navigation.navigate({
//     //     pathname: '/auth/sign-up', // route name where you want to go back
//     //     params: { selectedAddress: selectedLocation.title }, // pass location title
//     //     merge: true,
//     //   });
//     // console.log(selectedLocation)
//       router.push({
//         pathname: '/auth/sign-up',
//         params: { 
//             title: selectedLocation.title,
//             longitude: selectedLocation.longitude,
//             latitude: selectedLocation.latitude,
//             longitudeDelta: selectedLocation.longitudeDelta,
//             latitudeDelta: selectedLocation.latitudeDelta,
//             formattedAddress: selectedLocation.address,
//             description: selectedLocation.description,
//             subregion: selectedLocation.subregion,
//             role: role

//          },
//         merge: true
//       })
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {region && (
//         <>
//           <MapView
//             ref={mapRef}
//             style={styles.map}
//             initialRegion={region}
//             onRegionChangeComplete={handleRegionChangeComplete}
//           />
//           <View style={styles.pinContainer}>
//             <MaterialIcons name="location-pin" size={40} color="red" />
//           </View>
//           {selectedLocation && (
//             <View style={styles.infoBox}>
//               <Text style={styles.title}>{selectedLocation.title}</Text>
//               <Text style={styles.description}>{selectedLocation.description}</Text>
//             </View>
//           )}
//           <TouchableOpacity style={styles.button} onPress={handleConfirmLocation}>
//             <Text style={styles.buttonText}>Use This Location</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: {
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height,
//   },
//   pinContainer: {
//     position: 'absolute',
//     top: Dimensions.get('window').height / 2 - 40,
//     left: Dimensions.get('window').width / 2 - 20,
//     zIndex: 1,
//   },
//   infoBox: {
//     position: 'absolute',
//     bottom: 110,
//     left: 20,
//     right: 20,
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 10,
//     elevation: 5,
//     zIndex: 2,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   description: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   button: {
//     position: 'absolute',
//     bottom: 40,
//     left: 40,
//     right: 40,
//     backgroundColor: '#2196F3',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonText: { color: 'white', fontSize: 16 },
// });
