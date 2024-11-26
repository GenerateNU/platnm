import { useState, useEffect, useCallback } from "react";
import { Button, StyleSheet, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Histogram from "@/components/media/Histogram";
import YourRatings from "@/components/media/YourRatings";
import FriendRatings from "@/components/media/FriendRatings";
import MediaCard from "@/components/media/MediaCard";
import ReviewStats from "@/components/media/ReviewStats";
import HeaderComponent from "@/components/HeaderComponent";
import ReviewPreview from "@/components/ReviewPreview";

export default function MediaPage() {
  const [media, setMedia] = useState<Media>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setReviewAvgRating] = useState<number | null>(null);
  const [ratingDistributions, setRatingDistributions] = useState<
    RatingDistribution[]
  >([]);

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const userId = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // TODO: RID OF THIS HARD CODING
  const { mediaId, mediaType } = useLocalSearchParams<{
    mediaId: string;
    mediaType: string;
  }>();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/media/${mediaType}/${mediaId}`)
      .then((response) => setMedia(response.data))
      .catch((error) => console.error(error));
  }, []);

  // calculating the rating distribution from the reviews that we already have
  useEffect(() => {
    const calculateRatingDistribution = () => {
      const distributionMap = new Map<number, number>();
      if (!reviews) {
        setRatingDistributions([]);
        return;
      }

      reviews.forEach((review) => {
        distributionMap.set(
          review.rating,
          (distributionMap.get(review.rating) || 0) + 1
        );
      });

      const distributionArray = Array.from(
        distributionMap,
        ([rating, count]) => ({
          rating,
          count,
        })
      ).sort((a, b) => a.rating - b.rating);

      setRatingDistributions(distributionArray);
    };

    calculateRatingDistribution();
  }, [reviews]);

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
    }, [media])
  );

  return (
    media && (
      <View style={{ backgroundColor: "#FFF" }}>
        <ScrollView
          style={{
            ...styles.scrollView,
          }}
          contentContainerStyle={{
            paddingBottom: 80, // Add padding at the bottom equal to the height of the bottom tab bar
          }}
        >
          <MediaCard media={media} />
          <View style={styles.bodyContainer}>
            <View style={styles.titleContainer}>
              {rating && <ReviewStats rating={rating} reviews={reviews} />}
            </View>
            {ratingDistributions.length > 0 && (
              <Histogram distribution={ratingDistributions} />
            )}
            <View style={styles.socialContainer}>
              <YourRatings
                user_id={userId}
                media_id={mediaId}
                media_type={mediaType}
              />
              <FriendRatings count={5} />
            </View>
            <View>
              {reviews?.map((review) => (
                <ReviewPreview
                  key={review.id}
                  preview={{
                    ...review,
                    review_id: review.id,
                    created_at: new Date(review.created_at),
                    updated_at: new Date(review.updated_at),
                    media_title: media.title,
                    tags: ["Excitement"],
                    review_stat: { comment_count: 5, upvotes: 4, downvotes: 2 },
                    media_artist: media.artist_name,
                    media_cover: media.cover,
                  }}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFF",
    paddingBottom: 100,
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
  bodyContainer: { marginTop: 16, paddingHorizontal: 16 },

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
});
