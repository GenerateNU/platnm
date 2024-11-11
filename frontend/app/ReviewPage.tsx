import HeaderComponent from "@/components/HeaderComponent";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

interface ReviewPageProps {
  route: {
    params: {
      review_id: string;
    };
  };
}

const ReviewPage: React.FC<ReviewPageProps> = ({ route }) => {
  const { review_id } = useLocalSearchParams<{
    review_id: string;
  }>();
  const [review, setReview] = useState<Preview>();
  const [comments, setComments] = useState<Comment[]>();
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const ratingImages = {
    0: require("../assets/images/Ratings/0Rating.png"),
    1: require("../assets/images/Ratings/1Rating.png"),
    2: require("../assets/images/Ratings/2Rating.png"),
    3: require("../assets/images/Ratings/3Rating.png"),
    4: require("../assets/images/Ratings/4Rating.png"),
    5: require("../assets/images/Ratings/5Rating.png"),
    6: require("../assets/images/Ratings/6Rating.png"),
    7: require("../assets/images/Ratings/7Rating.png"),
    8: require("../assets/images/Ratings/8Rating.png"),
    9: require("../assets/images/Ratings/9Rating.png"),
    10: require("../assets/images/Ratings/10Rating.png"),
  };

  const getRatingImage = (rating: keyof typeof ratingImages) => {
    return ratingImages[rating]; // Access the image from the preloaded images object
  };
  // Fetch the review data using the review_id
  useEffect(() => {
    const fetchReview = async () => {
      console.log("fetchReviews");

      console.log("review_id", review_id);
      try {
        const response = await axios.get(`${BASE_URL}/reviews/${review_id}`);
        console.log("response", response.data);
        setReview(response.data);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    const fetchComments = async () => {
      console.log("fetchReviews");
      console.log("review_id", review_id);
      try {
        const response = await axios.get(
          `${BASE_URL}/reviews/comments/${review_id}`,
        );
        console.log("response", response.data);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchReview();
    fetchComments();
  }, []);

  return review ? (
    <View style={styles.container}>
      <HeaderComponent title="Review" />
      <ScrollView style={styles.container}>
        <View style={styles.reviewContainer}>
          <Text style={styles.songName}>{review.display_name}</Text>
          <Text style={styles.artistName}>{review.username}</Text>
          <Image
            source={{ uri: review.media_cover }}
            style={styles.coverImage}
          />
          <Text style={styles.songName}>{review.media_title}</Text>
          <Text style={styles.artistName}>{review.media_artist}</Text>
          <Text style={styles.comment}>{review.comment}</Text>
          {/* Rating Image on the right side of the song title */}
          <View>
            <Image
              source={getRatingImage(
                review.rating as keyof typeof ratingImages,
              )}
            />
          </View>
          <View>
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => {
                return (
                  //<Comment key={index} comment={comment} />
                  null
                );
              })
            ) : (
              <Text style={styles.noReviewsText}>No comments found.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  ) : (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  reviewContainer: {
    alignItems: "center",
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  songName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  artistName: {
    fontSize: 18,
    color: "#888",
  },
  comment: {
    fontSize: 16,
    marginVertical: 10,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noReviewsText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
});

export default ReviewPage;
