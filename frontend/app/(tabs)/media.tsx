import React, { useState, useEffect } from "react";
import { Button, StyleSheet, ScrollView } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import ReviewStats from "@/components/media/ReviewStats";
import MediaCard from "@/components/media/MediaCard";
import { BASE_URL } from "@env";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MediaScreen() {
  const insets = useSafeAreaInsets();

  const [media, setMedia] = useState<Media>();
  const [reviews, setReviews] = useState<Review[]>([]);

  console.log(BASE_URL);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/media?sort=recent`)
      .then((response) => setMedia(response.data[0]))
      .catch((error) => console.error(error));
    axios
      .get(`${BASE_URL}/reviews/track/1`)
      .then((response) => setReviews(response.data.reviews))
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
          <ReviewStats />
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
