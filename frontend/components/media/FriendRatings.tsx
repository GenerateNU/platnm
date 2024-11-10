import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ArrowRight from "@/assets/images/Media/arrowRight.svg";

type FriendRatingsProps = {
  count: number;
};

const FriendRatings = ({ count }: FriendRatingsProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => console.log("pressed!")}
    >
      <View style={styles.textContainer}>
        <Text style={styles.text}>Reviewed by</Text>
        <View style={styles.countBubble}>
          <Text style={styles.countText}>{count} friends</Text>
        </View>
      </View>
      <ArrowRight />
    </TouchableOpacity>
  );
};

export default FriendRatings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  text: {
    fontFamily: "NeueHaasUnicaPro-Bold",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "bold",
  },
  countBubble: {
    backgroundColor: "#000",
    borderRadius: 20,
  },
  countText: {
    color: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
