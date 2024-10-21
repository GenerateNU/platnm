import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Visibility from "@/components/Visibility";
import { Divider } from "react-native-paper";
import HeaderComponent from "@/components/HeaderComponent";

import Tags from "@/components/Tags";
import Nudge from "@/components/Nudge";
import ReviewCard from "@/components/ReviewCard";
import DraftButton from "@/components/DraftButton";
import PublishButton from "@/components/PublishButton";
import { useLocalSearchParams } from "expo-router";

const PreviewReview = () => {
  const { rating, review } = useLocalSearchParams<{
    rating: string;
    review: string;
  }>();

  return (
    <View style={styles.container}>
      <HeaderComponent title="Preview Review" />
      <ScrollView>
        <ReviewCard rating={parseFloat(rating)} review={review} />
        <Divider />
        <Tags />
        <Divider />
        <Visibility />
        <Divider />
        <Nudge />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <DraftButton />
        <PublishButton rating={parseFloat(rating)} review={review} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff", // Optional: Add a background color if needed
  },
});

export default PreviewReview;
