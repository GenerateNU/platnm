import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ReviewStats = () => {
  return (
    <View style={styles.container}>
      <View style={styles.statContainer}>
        <Text style={styles.statText}>10,000</Text>
        <Text>Total ratings</Text>
      </View>
      <View style={styles.statContainer}>
        <View>
          <Text style={styles.statText}>4.5 / 5</Text>
          {/* <Icon></Icon> */}
        </View>
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
