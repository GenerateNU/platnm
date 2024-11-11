import { useState, useEffect, useCallback } from "react";
import { Button, StyleSheet, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import axios from "axios";
import Histogram from "@/components/media/Histogram";
import YourRatings from "@/components/media/YourRatings";
import FriendRatings from "@/components/media/FriendRatings";
import MediaCard from "@/components/media/MediaCard";
import ReviewStats from "@/components/media/ReviewStats";
import HeaderComponent from "@/components/HeaderComponent";
import ReviewPreview from "@/components/ReviewPreview";

type MediaResponse = {
  media: Media;
  reviewCount: number;
};

export default function MediaPage() {
  const [media, setMedia] = useState<Media>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setReviewAvgRating] = useState<number | null>(null);

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { mediaId, mediaType } = useLocalSearchParams<{
    mediaId: string;
    mediaType: string;
  }>();

  console.log(mediaId, mediaType);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/media/${mediaType}/${mediaId}`)
      .then((response) => {
        console.log(response);
        setMedia(response.data);
      }) // TODO: update this hardcoding
      .catch((error) => console.error(error));
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (media) {
        axios
          .get(`${BASE_URL}/reviews/${mediaType}/${mediaId}`)
          .then((response) => {
            setReviews(response.data.reviews);
            setReviewAvgRating(response.data.avgRating.toFixed(2) / 2 || null);
          })
          .catch((error) => console.error(error));
      }
    }, [media]),
  );

  return (
    media && (
      <View style={{ backgroundColor: "#FFF" }}>
        <HeaderComponent title="" />
        <ScrollView style={styles.scrollView}>
          <View>
            <MediaCard media={media} />
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.addReviewContainer}>
              <Button
                onPress={() =>
                  navigation.navigate("CreateReview", {
                    mediaName: media.title,
                    mediaType: media.media_type,
                    mediaId: media.id,
                    cover: media.cover,
                    artistName: media.artist_name,
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
              <ReviewPreview
                preview={{
                  ...review,
                  created_at: new Date(review.created_at),
                  updated_at: new Date(review.updated_at),
                  username: "john_doe",
                  display_name: "John Doe",
                  profile_picture: "https://i.pravatar.cc/150?u=john_doe",
                  media_title: media.title,
                  tags: ["Excitement"],
                  review_stat: { comment_count: 5, upvotes: 4, downvotes: 2 },
                  media_artist: "Taylor Swift",
                  media_cover:
                    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png",
                }}
              />
              // <ReviewCard
              //   key={review.id}
              //   rating={review.rating}
              //   comment={review.comment}
              // />
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
