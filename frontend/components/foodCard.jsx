import React, { useState } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

export default function FoodCard({
  foodName = "Food Name",
  description = "Delicious food description...",
  total = "0 PKR",
  portions = "0",
  type = "Paid", 
  status = "Pick up time: 00:00 am",
  phone="",
  statusTime = "",
  rest_name="",
  imageSource,
  showPhoneNumber,
  showTrackButton,
  showCancelOption,
  showRateOption,
  showCompleteOption,
  showCheckoutOption,
  onTrackPress,
  onCancelPress,
  onCompletePress,
  onRatePress,
  onCheckoutPress,
  onPress, // New prop for card press
}) {
  // States for button presses
  const [trackPressed, setTrackPressed] = useState(false);
  const [cancelPressed, setCancelPressed] = useState(false);
  const [ratePressed, setRatePressed] = useState(false);
  const [completePressed, setCompletePressed] = useState(false);
  const [checkoutPressed, setCheckoutPressed] = useState(false);

  const CardContent = () => (
    <>
      <View style={styles.cardContainer}>
        <Image source={imageSource} style={styles.foodImage} />
        <View style={styles.detailsContainer}>
          <View style={styles.header}>
            <Text style={styles.foodName}>{foodName}</Text>
            <Text style={[styles.type, type === "Free" && styles.freeType]}>
              {type}
            </Text>
            
          </View>
          {/* <View style={styles.row}> */}
          <View style={styles.row}>
            <Text style={styles.total}>Donor: {rest_name}</Text>
          </View>
            
          <View style={styles.row}>
            {showPhoneNumber && (
            <Text style={styles.total}>Phone: {phone}</Text>
        )}
          </View>
            
          <View style={styles.row}>
            <Text style={styles.total}>Total: {total}</Text>
            <Text style={styles.portions}>Portions: {portions}</Text>
          </View>
          
          <Text style={styles.status}>
            <Text>Pick Up Time: </Text> {status && <Text>{status}</Text>}
          </Text>
          <Text style={styles.status}>
            <Text>Date: </Text> {statusTime && <Text>{statusTime}</Text>}
          </Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        {showCheckoutOption && (
          <TouchableOpacity
            style={[
              styles.btn,
              checkoutPressed
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: Colors.White, borderColor: Colors.primary, borderWidth: 1 },
            ]}
            onPress={() => {
              setCheckoutPressed(!checkoutPressed);
              onCheckoutPress?.();
            }}
          >
            <Text
              style={[
                styles.btnText,
                checkoutPressed
                  ? { color: Colors.White }
                  : { color: Colors.primary },
              ]}
            >
              Checkout
            </Text>
          </TouchableOpacity>
        )}
        {showTrackButton && (
          <TouchableOpacity
            style={[
              styles.btn,
              trackPressed
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: Colors.White, borderColor: Colors.primary, borderWidth: 1 },
            ]}
            onPress={() => {
              setTrackPressed(!trackPressed);
              onTrackPress?.();
            }}
          >
            <Text
              style={[
                styles.btnText,
                trackPressed
                  ? { color: Colors.White }
                  : { color: Colors.primary },
              ]}
            >
              Track Order
            </Text>
          </TouchableOpacity>
        )}
        {showCancelOption && (
          <TouchableOpacity
            style={[
              styles.btn,
              cancelPressed
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: Colors.White, borderColor: Colors.primary, borderWidth: 1 },
            ]}
            onPress={() => {
              setCancelPressed(!cancelPressed);
              onCancelPress?.();
            }}
          >
            <Text
              style={[
                styles.btnText,
                cancelPressed
                  ? { color: Colors.White }
                  : { color: Colors.primary },
              ]}
            >
              Cancel Order
            </Text>
          </TouchableOpacity>
        )}
        {showRateOption && (
          <TouchableOpacity
            style={[
              styles.btn,
              ratePressed
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: Colors.White, borderColor: Colors.primary, borderWidth: 1 },
            ]}
            onPress={() => {
              setRatePressed(!ratePressed);
              onRatePress?.();
            }}
          >
            <Text
              style={[
                styles.btnText,
                ratePressed
                  ? { color: Colors.White }
                  : { color: Colors.primary },
              ]}
            >
              Rate Order
            </Text>
          </TouchableOpacity>
        )}
        {showCompleteOption && (
          <TouchableOpacity
            style={[
              styles.btn,
              completePressed
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: Colors.White, borderColor: Colors.primary, borderWidth: 1 },
            ]}
            onPress={() => {
              setCompletePressed(!completePressed);
              onCompletePress?.();
            }}
          >
            <Text
              style={[
                styles.btnText,
                completePressed
                  ? { color: Colors.White }
                  : { color: Colors.primary },
              ]}
            >
              Complete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  return (
    <View style={styles.headContainer}>
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <CardContent />
        </TouchableOpacity>
      ) : (
        <CardContent />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headContainer: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,

  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop:8
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  type: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#009688",
  },
  freeType: {
    color: "#4CAF50",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop:4
  },
  total: {
    fontSize: 12,
    color: "#333",
  },
  portions: {
    fontSize: 12,
    color: "#333",
  },
  status: {
    fontSize: 12,
    color: "#009688",
    marginTop: 5,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: 'wrap',
  },
  btn: {
    borderRadius: 20,
    minWidth: 120,
    height: 37,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "400",
  },
});

