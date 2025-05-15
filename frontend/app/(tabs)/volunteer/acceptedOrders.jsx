// import React from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Colors } from '../../../constants/Colors';

// const AcceptedOrders = () => {
//   // In a real app, you would fetch these from your state management or API
//   const acceptedOrders = [
//     {
//       id: 'ORD-12345',
//       foodName: 'Chicken Biryani',
//       foodPic: require('../../../assets/images/biryaniPng.png'),
//       pickupTime: '11:00 PM',
//       price: '0 PKR',
//       type: 'Free',
//       orgId: 'ORG-789',
//       donorName: 'Hot N Spicy',
//       donorAddress: 'North Nazimabad, Block L, Karachi',
//       receiverName: 'Food Savers',
//       receiverAddress: 'C-456, Block 18, F.B Area, Karachi',
//       toReceiver: '2km',
//       toDonor: '3km',
//       status: 'accepted',
//       acceptedAt: new Date().toISOString()
//     },
//     // Add more accepted orders as needed
//   ];

//   const handleCompleteOrder = (orderId) => {
//     // Implement order completion logic
//     console.log('Completing order:', orderId);
//     // apiClient.patch(`/orders/${orderId}/complete`);
//   };

//   const getTypeStyle = (type) => {
//     switch(type) {
//       case 'Free': return styles.freeType;
//       case 'Direct': return styles.directType;
//       case 'Negotiated': return styles.negotiatedType;
//       default: return styles.freeType;
//     }
//   };

//   const handleCancelOrder = (orderId) => {
//     // Implement order cancellation logic
//     console.log('Canceling order:', orderId);
//     // apiClient.patch(`/orders/${orderId}/cancel`);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {acceptedOrders.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="fast-food" size={60} color={Colors.primary} />
//           <Text style={styles.emptyText}>No accepted orders yet</Text>
//           <Text style={styles.emptySubtext}>Accepted orders will appear here</Text>
//         </View>
//       ) : (
//         acceptedOrders.map((order) => (
//           <View key={order.id} style={styles.card}>
//             <View style={styles.contentContainer}>
//               <Image source={order.foodPic} style={styles.foodImage} />
              
//               <View style={styles.orderInfo}>
//                 <View style={styles.titleRow}>
//                   <Text style={styles.foodTitle}>{order.foodName}</Text>
//                   <Text style={[styles.type, getTypeStyle(order.type)]}>
//                       {order.type.toUpperCase()}
//                   </Text>
//                 </View>
//                 <Text style={styles.idText}>Order ID: {order.id.slice(-6).toUpperCase()}</Text>
//                 <Text style={styles.detailText}>Pickup by: {order.pickupTime}</Text>
//                 <Text style={[styles.detailText, { color: Colors.primary }]}>Price: {order.price}</Text>
//                 <Text style={styles.detailText}>Accepted at: {new Date(order.acceptedAt).toLocaleString()}</Text>
//               </View>
//             </View>

//             <View style={styles.buttonRow}>
//               <TouchableOpacity 
//                 style={[styles.actionButton, styles.completeButton]}
//                 onPress={() => handleCompleteOrder(order.id)}
//               >
//                 <Text style={styles.buttonText}>Go To Donor</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={[styles.actionButton, styles.cancelButton]}
//                 onPress={() => handleCancelOrder(order.id)}
//               >
//                 <Text style={[styles.buttonText, { color: Colors.primary }]}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F8F8',
//     padding: 15,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color: Colors.dark,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: Colors.Grey,
//     marginTop: 10,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   contentContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   foodImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 50,
//     marginRight: 15,
//   },
//   orderInfo: {
//     flex: 1,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   foodTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 10,
//   },
//   type: {
//       fontSize: 12,
//       fontWeight: 'bold',
//       paddingVertical: 2,
//       paddingHorizontal: 8,
//       borderRadius: 10,
//       overflow: 'hidden',
//     },
//     freeType: {
//       backgroundColor: '#c20b00',
//       color: Colors.White,
//     },
//     directType: {
//       backgroundColor: Colors.primary,
//       color: Colors.White,
//     },
//     negotiatedType: {
//       backgroundColor: '#008000',
//       color: Colors.White,
//     },
//   acceptedBadge: {
//     backgroundColor: Colors.primaryLight,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   idText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   detailText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginVertical: 10,
//   },
//   locationSection: {
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: Colors.dark,
//     marginBottom: 8,
//   },
//   locationCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.lightGray,
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 5,
//   },
//   locationText: {
//     fontSize: 14,
//     color: Colors.dark,
//     marginLeft: 10,
//     flex: 1,
//   },
//   distanceText: {
//     fontSize: 14,
//     color: Colors.primary,
//     textAlign: 'right',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     marginTop: 10,
//   },
//   actionButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   completeButton: {
//     flex: 1,
//     backgroundColor: Colors.primary,
//     paddingVertical: 10,
//     borderRadius: 25,
//     marginRight: 5,
//     alignItems: 'center',
//   },
//   cancelButton: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 25,
//     marginLeft: 5,
//     borderWidth: 1.5,
//     alignItems: 'center',
//     borderColor: Colors.primary
//   },
//   buttonText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: Colors.White,
//   },
// });

// export default AcceptedOrders;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import apiClient from '../../../utils/apiClient';

const AcceptedOrders = () => {
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAcceptedOrders = async () => {
    try {
      const response = await apiClient.get('/order/rider/accepted');
      setAcceptedOrders(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch accepted orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedOrders();
  }, []);

  const getTypeStyle = (type) => {
    switch (type) {
      case 'Free':
        return styles.freeType;
      case 'Direct':
        return styles.directType;
      case 'Negotiated':
        return styles.negotiatedType;
      default:
        return styles.freeType;
    }
  };

  const handleCompleteOrder = (orderId) => {
    console.log('Completing order:', orderId);
  };

  const handleCancelOrder = (orderId) => {
    console.log('Cancelling order:', orderId);
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.primary} />;
  }

  return (
    <ScrollView style={styles.container}>
      {acceptedOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="fast-food" size={60} color={Colors.primary} />
          <Text style={styles.emptyText}>No accepted orders yet</Text>
          <Text style={styles.emptySubtext}>Accepted orders will appear here</Text>
        </View>
      ) : (
        acceptedOrders.map((order) => (
          <View key={order._id} style={styles.card}>
            <View style={styles.contentContainer}>
              <Image
                source={{ uri: order.donation?.listingImages?.[0] }}
                style={styles.foodImage}
              />
              <View style={styles.orderInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.foodTitle}>{order.donation?.donationFoodTitle}</Text>
                  {/* <Text style={[styles.type, getTypeStyle(order.paymentMethod)]}>
                    {order.paymentMethod?.replace(/_/g, ' ').toUpperCase()}
                  </Text> */}
                </View>
                <Text style={styles.idText}>Order ID: {order._id}</Text>
                <Text style={styles.detailText}>
                  Pickup by: {order.pickupDetails?.scheduledTime?.startingTime}
                </Text>
                <Text style={[styles.detailText, { color: Colors.primary }]}>
                  Price: {order.orderTotal} PKR
                </Text>
                <Text style={styles.detailText}>
                  Accepted at: {new Date(order.updatedAt).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => handleGoToDonor(order.id)}
                onPress={() => handleCompleteOrder(order._id)}
              >
                <Text style={styles.buttonText}>Go To Donor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleCancelOrder(order._id)}
              >
                <Text style={[styles.buttonText, { color: Colors.primary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: Colors.dark,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.Grey,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 15,
  },
  orderInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  type: {
      fontSize: 12,
      fontWeight: 'bold',
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 10,
      overflow: 'hidden',
    },
    freeType: {
      backgroundColor: '#c20b00',
      color: Colors.White,
    },
    directType: {
      backgroundColor: Colors.primary,
      color: Colors.White,
    },
    negotiatedType: {
      backgroundColor: '#008000',
      color: Colors.White,
    },
  acceptedBadge: {
    backgroundColor: Colors.primaryLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  idText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  locationSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 8,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: Colors.dark,
    marginLeft: 10,
    flex: 1,
  },
  distanceText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    marginLeft: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    borderColor: Colors.primary
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.White,
  },
});

export default AcceptedOrders;