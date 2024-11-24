import React from "react";
import { router } from "expo-router"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ArrowRight from "@/assets/images/Media/arrowRight.svg";

type YourRatingsProps = {
  count: number | null;
  mediaType: string;
  mediaId: string;
};

const YourRatings = ({ count, mediaType, mediaId }: YourRatingsProps) => {
  console.log(count)
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push({
        pathname: "/MediaReviewsPage",
        params: {
          mediaType: mediaType
          mediaId: mediaId,
          filter="user",
        },
      })}
    >
      <View style={styles.textContainer}>
        <Text style={styles.text}>You've rated this song</Text>
        <View style={styles.countBubble}>
          <Text style={styles.countText}>{count}x</Text>
        </View>
      </View>
      <ArrowRight />
    </TouchableOpacity>
  );
};

export default YourRatings;

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
