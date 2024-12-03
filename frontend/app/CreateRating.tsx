import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

import HeaderComponent from "@/components/HeaderComponent";
import DraftButton from "@/components/DraftButton";
import PublishButton from "@/components/PublishButton";
import RatingSlider from "@/components/media/RatingSlider";
import MediaCard from "@/components/media/MediaCard";
import { usePublishReview } from "@/hooks/usePublishReview";

const CreateRating = () => {
  const { mediaType, mediaId } = useLocalSearchParams<{
    mediaType: string;
    mediaId: string;
  }>();

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [media, setMedia] = useState<Media>();
  const [rating, setRating] = useState(1);

  const { publishReview } = usePublishReview();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleDraftSubmit = () => {
    publishReview(mediaType, parseInt(mediaId), "", rating, [], true);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/media/${mediaType}/${mediaId}`)
      .then((response) => setMedia(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    media && (
      <View style={styles.container}>
        <HeaderComponent title="Log Song" centered />
        <MediaCard media={media} showTopBar={false} showRateButton={false} />
        <View style={styles.inner}>
          <RatingSlider value={rating} onRatingChange={handleRatingChange} />
          <View style={styles.buttonContainer}>
            <DraftButton handleClick={() => handleDraftSubmit()} />
            <PublishButton
              handleClick={() =>
                router.push({
                  pathname: "/CreateReview",
                  params: {
                    mediaType: mediaType,
                    mediaId: mediaId,
                  },
                })
              }
            />
          </View>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  inner: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 30,
    paddingTop: 15,
  },
  titleInput: {
    backgroundColor: "#ffffff",
    color: "#434343",
    fontWeight: "bold",
    fontSize: 16,
  },
  textInput: {
    height: 80,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    color: "#434343",
    fontSize: 16,
    textAlignVertical: "top",
    justifyContent: "flex-end",
  },
});

export default CreateRating;
