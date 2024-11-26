import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ReviewPreview from "@/components/ReviewPreview";

interface TopReviewsProps {
  reviews: Preview[];
}

const TopReviews = ({ reviews }: TopReviewsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Reviews</Text>
      {reviews.map((review, index) => {
        return <ReviewPreview key={index} preview={review} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 8,
  },
});

export default TopReviews;
