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
      <View style={styles.reviewsContainer}>
        {reviews.map((review, index) => {
          return <ReviewPreview key={index} preview={review} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 28,
    paddingBottom: 12,
    paddingTop: 32,
  },
  container: {
    flexDirection: "row",
  },
  reviewsContainer: {
    marginTop: -8,
    paddingHorizontal: 8,
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
