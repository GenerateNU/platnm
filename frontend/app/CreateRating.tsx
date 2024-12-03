import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

import HeaderComponent from "@/components/HeaderComponent";
import RatingSlider from "@/components/media/RatingSlider";
import MediaCard from "@/components/media/MediaCard";
import RateFlowButton from "@/components/media/RateFlowButton";
import { useAuthContext } from "@/components/AuthProvider";
import { usePublishReview } from "@/hooks/usePublishReview";

const CreateRating = () => {
  const { mediaType, mediaId } = useLocalSearchParams<{
    mediaType: string;
    mediaId: string;
  }>();
  const userId = useAuthContext().userId;
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [media, setMedia] = useState<Media>();
  const [rating, setRating] = useState(1);

  const { publishReview } = usePublishReview();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleRatingSubmit = async () => {
    const request = {
      user_id: userId,
      media_type: mediaType,
      media_id: parseInt(mediaId),
      rating: rating,
      tags: [],
      draft: false,
    };
    await publishReview(request);
    routeToMediaPage();
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/media/${mediaType}/${mediaId}`)
      .then((response) => setMedia(response.data))
      .catch((error) => console.error(error));
  }, []);

  const routeToMediaPage = () => {
    router.push({
      pathname: "/MediaPage",
      params: { mediaId: mediaId, mediaType: mediaType },
    });
  };

  return (
    media && (
      <View style={styles.container}>
        <HeaderComponent title="Log Song" centered />
        <MediaCard media={media} showTopBar={false} showRateButton={false} />
        <View style={styles.inner}>
          <RatingSlider value={rating} onRatingChange={handleRatingChange} />
          <View style={styles.buttonContainer}>
            <RateFlowButton
              text="Share Rating"
              primary={false}
              handleClick={handleRatingSubmit}
            />
            <RateFlowButton
              text="Review"
              iconName="arrow-up"
              handleClick={() =>
                router.push({
                  pathname: "/CreateReview",
                  params: {
                    mediaType: mediaType,
                    mediaId: mediaId,
                    rating: rating,
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
    paddingHorizontal: 20,
  },
});

export default CreateRating;
