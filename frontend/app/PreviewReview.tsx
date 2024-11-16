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
import { usePublishReview } from "@/hooks/usePublishReview";

const PreviewReview = () => {
  const { rating, review, mediaType, mediaId } = useLocalSearchParams<{
    rating: string;
    review: string;
    mediaName: string;
    mediaType: string;
    mediaId: string;
  }>();

  const { publishReview } = usePublishReview();
  const handleSubmit = (draft: boolean) => {
    publishReview(
      mediaType,
      parseInt(mediaId),
      review,
      parseFloat(rating),
      [],
      draft,
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title="Preview Review" />
      <ScrollView>
        <ReviewCard rating={parseFloat(rating)} comment={review} />
        <Divider />
        <Tags />
        <Divider />
        <Visibility />
        <Divider />
        <Nudge />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <DraftButton handleClick={() => handleSubmit(true)} />
        <PublishButton handleClick={() => handleSubmit(false)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
});

export default PreviewReview;
