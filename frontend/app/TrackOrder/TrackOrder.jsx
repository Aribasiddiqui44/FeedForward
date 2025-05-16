import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import Head from "../../components/header";
import { Colors } from "../../constants/Colors";
import apiClient from "../../utils/apiClient";

export default function TrackOrder() {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const {
    foodName,
    statusTime,
    imageSource,
    portions,
    total,
    date,
    orderFrom,
    deliverTo,
    orderStatus,
    orderId
  } = useLocalSearchParams();

  const [currentStatus, setCurrentStatus] = useState(orderStatus);
  const trackingStatuses = ['processing', 'ready_for_pickup', 'in_transit', 'delivered'];

const trackingSteps = [
  { label: "Your order has been received", status: "processing" },
  { label: "The volunteer is arrived at your pick up location", status: "ready_for_pickup" },
  { label: "Your order has been picked up for delivery", status: "in_transit" },
  { label: "Order arriving soon!", status: "delivered" },
];


  // Polling every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await apiClient.get(`/order/${orderId}`);
        setCurrentStatus(res.data.data.orderStatus);
      } catch (err) {
        console.error("Error fetching latest order status:", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  const handleBackPress = () => {
    router.back();
  };

  return (
    <>
      <Head label="Track Order" showBackOption={true} onBackPress={handleBackPress} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={imageSource} style={styles.foodImage} />
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.detailsBox}>
            <Text style={styles.detail}><Text style={styles.label}>Donor: </Text>{orderFrom}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Receiver: </Text>{deliverTo}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Portions: </Text>{portions}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Pick-up time: </Text>{statusTime}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Total: </Text>{total}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Distance: </Text>2km</Text>
            <Text style={styles.detail}><Text style={styles.label}>Status: </Text>{currentStatus}</Text>
          </View>

          {/* <View style={styles.locationBox}>
            <Text style={styles.locationLabel}>📍 Order from</Text>
            <Text style={styles.location}>{orderFrom}</Text>
            <Text style={styles.locationLabel}>📍 Deliver to</Text>
            <Text style={styles.location}>{deliverTo}</Text>
          </View> */}
          <View style={styles.timelineContainer}>
  {trackingSteps.map((step, index) => {
    const isCompleted = trackingStatuses.indexOf(currentStatus) > trackingStatuses.indexOf(step.status);
    const isCurrent = currentStatus === step.status;

    return (
      <View key={index} style={styles.timelineItem}>
        {/* Vertical Line */}
        {index !== 0 && (
          <View style={[styles.verticalLine, 
            isCompleted || isCurrent ? styles.activeLine : styles.inactiveLine]} 
          />
        )}

        {/* Step Circle */}
        <View style={[styles.outerCircle, 
          isCompleted ? styles.completedOuterCircle : isCurrent ? styles.currentOuterCircle : styles.inactiveOuterCircle]}>
          {isCompleted && <View style={styles.innerCheck} />}
        </View>

        {/* Step Label */}
        <Text style={[
          styles.stepLabel,
          isCompleted ? styles.completedLabel : isCurrent ? styles.currentLabel : styles.inactiveLabel
        ]}>
          {step.label}
        </Text>
      </View>
    );
  })}
</View>


          <TouchableOpacity style={styles.button} onPress={() => router.push('./../orderReceipt/OrderReceipt')}>
            <Text style={styles.buttonText}>Show Receipt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
  },
  timelineContainer: {
  padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
},

circle: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: '#ccc',
  position: 'absolute',
  left: 0,
  top: 3,
},
activeCircle: {
  backgroundColor: '#00b894',
},
stepLabel: {
  fontSize: 14,
  color: '#aaa',
},
activeLabel: {
  color: '#00b894',
  fontWeight: 'bold',
},
line: {
  height: 20,
  width: 2,
  backgroundColor: '#ccc',
  position: 'absolute',
  left: 5,
  top: 16,
},

  contentContainer: {
    padding: 18,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: Colors.primary,
    height: 210,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 18
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.White,
  },
  date: {
    fontSize: 14,
    color: Colors.White,
    marginTop: 5,
  },
  detailsBox: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  detail: {
    fontSize: 14,
    marginVertical: 5,
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  locationBox: {
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#00b894",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
timelineItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 30,
  position: 'relative',
},
verticalLine: {
  position: 'absolute',
  left: 13,
  top: -30,
  height: 30,
  width: 2,
},
activeLine: {
  backgroundColor: '#00b894',
},
inactiveLine: {
  backgroundColor: '#ccc',
},
outerCircle: {
  width: 26,
  height: 26,
  borderRadius: 13,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
},
completedOuterCircle: {
  backgroundColor: '#00b894',
},
currentOuterCircle: {
  backgroundColor: '#fff',
  borderWidth: 3,
  borderColor: '#00b894',
},
inactiveOuterCircle: {
  backgroundColor: '#ccc',
},
innerCheck: {
  width: 10,
  height: 10,
  backgroundColor: '#fff',
  borderRadius: 5,
},
stepLabel: {
  marginLeft: 15,
  flex: 1,
  fontSize: 15,
},
completedLabel: {
  color: '#00b894',
  fontWeight: 'bold',
},
currentLabel: {
  color: '#00b894',
},
inactiveLabel: {
  color: '#999',
},

});
