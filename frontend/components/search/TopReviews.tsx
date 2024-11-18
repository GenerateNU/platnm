import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ReviewPreview from "@/components/ReviewPreview";

interface TopReviewsProps {
  reviews: Preview[];
}

const TopReviews = ({ reviews }: TopReviewsProps) => {
  return (
    <View>
      <Text style={styles.title}>Top Reviews</Text>
      {reviews.map((review, index) => {
        return <ReviewPreview key={index} preview={review} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  container: {
    flexDirection: "row",
  },
  songName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#434343",
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#434343",
    marginBottom: 4,
  },
});

export default TopReviews;
