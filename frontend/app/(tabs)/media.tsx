import { useState, useEffect } from "react";
import { Button, StyleSheet, ScrollView, Text } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import MediaCard from "@/components/media/MediaCard";
import ReviewStats from "@/components/media/ReviewStats";
import TopReview from "@/components/media/TopReview";
import axios from "axios";

export default function MediaScreen() {
  const insets = useSafeAreaInsets();

  const [media, setMedia] = useState<Media>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setReviewAvgRating] = useState<number | null>(null); 

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/media?sort=recent`)
      .then((response) => setMedia(response.data[0]))
      .catch((error) => console.error(error));
    axios
      .get(`${BASE_URL}/reviews/track/1`)
      .then((response) => {
        setReviews(response.data.reviews);
        setReviewAvgRating(response.data.avgRating || null);
      })
      .catch((error) => console.error(error));
    }, []);
    
  return (
    media && (
      <ScrollView style={{ ...styles.scrollView, paddingTop: insets.top }}>
        <ThemedView>
          <MediaCard media={media} />
        </ThemedView>
        <ThemedView style={styles.buttonContainer}>
          <ThemedView style={styles.addReviewContainer}>
            <Button color={"white"} title="Add rating" />
          </ThemedView>
          <ThemedView style={styles.saveReviewContainer}>
            <Button color={"white"} title="Save" />
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.titleContainer}>
        {rating !== null && <ReviewStats rating={rating} reviews={reviews} />}
        </ThemedView>
        <ThemedView>
          <TopReview reviews={reviews}/>
        </ThemedView>
      </ScrollView>
    )
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
  },
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  metadataContainer: {
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 16,
  },
  addReviewContainer: {
    backgroundColor: "#000000",
    borderRadius: 8,
    flexGrow: 2,
    padding: 8,
  },
  saveReviewContainer: {
    backgroundColor: "#444242",
    borderRadius: 8,
    flexGrow: 1,
    padding: 8,
  },
});
