import { useState, useEffect, useCallback } from "react";
import { Button, StyleSheet, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { useFocusEffect, useNavigation } from "expo-router";
import axios from "axios";
import ReviewCard from "@/components/ReviewCard";
import Histogram from "@/components/media/Histogram";
import YourRatings from "@/components/media/YourRatings";
import FriendRatings from "@/components/media/FriendRatings";
import MediaCard from "@/components/media/MediaCard";
import ReviewStats from "@/components/media/ReviewStats";

type MediaResponse = {
  media: Media;
  reviewCount: number;
};

export default function MediaPage() {
  const [media, setMedia] = useState<MediaResponse>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setReviewAvgRating] = useState<number | null>(null);

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const insets = useSafeAreaInsets();
  const height = useBottomTabBarHeight();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/media?sort=review`)
      .then((response) => setMedia(response.data[0])) // TODO: update this hardcoding
      .catch((error) => console.error(error));
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (media) {
        axios
          .get(
            `${BASE_URL}/reviews/${media.media.media_type}/${media.media.id}`,
          )
          .then((response) => {
            setReviews(response.data.reviews);
            // convert to
            setReviewAvgRating(response.data.avgRating.toFixed(2) / 2 || null);
          })
          .catch((error) => console.error(error));
      }
    }, [media]),
  );

  return (
    media && (
      <View style={{ backgroundColor: "#FFF" }}>
        <ScrollView
          style={{
            ...styles.scrollView,
            marginTop: insets.top,
          }}
          contentContainerStyle={{
            paddingBottom: height - insets.top, // Add padding at the bottom equal to the height of the bottom tab bar
          }}
        >
          <View>
            <MediaCard media={media.media} />
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.addReviewContainer}>
              <Button
                onPress={() =>
                  navigation.navigate("CreateReview", {
                    mediaName: media.media.title,
                    mediaType: media.media.media_type,
                    mediaId: media.media.id,
                    cover: media.media.cover,
                    artistName: media.media.artist_name,
                  })
                }
                color={"white"}
                title="Add rating"
              />
            </View>
            <View style={styles.saveReviewContainer}>
              <Button color={"white"} title="Save" />
            </View>
          </View>
          <View style={styles.titleContainer}>
            {rating && <ReviewStats rating={rating} reviews={reviews} />}
          </View>
          <Histogram />
          <View style={styles.socialContainer}>
            <YourRatings count={3} />
            <FriendRatings count={5} />
          </View>
          <View>
            {reviews?.map((review) => (
              <ReviewCard
                key={review.id}
                rating={review.rating}
                comment={review.comment}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  metadataContainer: {
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
  },
  socialContainer: {
    flexDirection: "column",
    gap: 8,
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
