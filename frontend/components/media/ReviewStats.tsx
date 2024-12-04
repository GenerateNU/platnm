import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RatingSvg from "./RatingSvg";

type ReviewStatsProps = {
  rating: number;
  count: number;
};

const ReviewStats = ({ rating, count }: ReviewStatsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.statContainer}>
        <Text style={styles.statText}>{count}</Text>
        <Text>Total ratings</Text>
      </View>
      <View style={styles.statContainer}>
        <RatingSvg rating={rating} width={50} height={50} />
        <Text>Avg. rating</Text>
      </View>
    </View>
  );
};

export default ReviewStats;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
  },
  statContainer: {
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    flex: 1,
  },
  statText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
