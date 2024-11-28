import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

export default function FoodCard({
  foodName = "Food Name",
  description = "Delicious food description...",
  total = "0 PKR",
  portions = "0",
  type = "Paid", 
  status = "Pick up time: 00:00 am", 
  statusTime = "",
  imageSource,
  showTrackButton,
  showCancelOption,
  showRateOption,
  showCompleteOption,
  onTrackPress,
  onCancelPress,
  onCompletePress,
  onRatePress,
}) {
  // States for button presses
  const [trackPressed, setTrackPressed] = useState(false);
  const [cancelPressed, setCancelPressed] = useState(false);
  const [ratePressed, setRatePressed] = useState(false);
  const [completePressed, setCompletePressed] = useState(false);

  return (
    <View style={styles.headContainer}>
      <View style={styles.cardContainer}>
        <Image source={imageSource} style={styles.foodImage} />
        <View style={styles.detailsContainer}>
          {/* Food Name and Type */}
          <View style={styles.header}>
            <Text style={styles.foodName}>{foodName}</Text>
            <Text style={[styles.type, type === "Free" && styles.freeType]}>
              {type}
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
          <View style={styles.row}>
            <Text style={styles.total}>Total: {total}</Text>
            <Text style={styles.portions}>Portions: {portions}</Text>
          </View>

          <Text style={styles.status}>
            {status} {statusTime && <Text>{statusTime}</Text>}
          </Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
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
    elevation: 3, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  type: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#009688", // Default color for "Paid"
  },
  freeType: {
    color: "#4CAF50", // Different color for "Free"
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    color: "#009688", // Green for statuses like "Pick up time"
    marginTop: 5,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    borderRadius: 20,
    width: 150,
    height: 37,
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
    marginTop: 24,
  },
  btnText: {
    fontSize: 15,
    fontWeight: "400",
  },
});
