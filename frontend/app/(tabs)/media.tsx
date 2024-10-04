import React, { useState, useEffect } from "react";
import { Button, Image, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { BASE_URL } from "@env";
import ReviewStats from "@/components/media/ReviewStats";
import MediaCard from "@/components/media/MediaCard";
import axios from "axios";

type Review = {
  id: number;
  userId: string;
  mediaType: string;
  mediaId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export default function MediaScreen() {
  const [reviews, setReviews] = useState<Review[]>([]);
  console.log(BASE_URL);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/reviews/track/1`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log(reviews);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.buttonContainer}>
        <MediaCard />
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  metadataContainer: {
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  addReviewContainer: {
    backgroundColor: "#000000",
    borderRadius: 8,
    flexGrow: 2,
    // paddingHorizontal: 48,
    padding: 8,
  },
  saveReviewContainer: {
    backgroundColor: "#444242",
    borderRadius: 8,
    flexGrow: 1,

    // paddingHorizontal: 16,
    padding: 8,
  },
});
