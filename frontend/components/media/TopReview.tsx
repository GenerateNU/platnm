import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, Image, StyleSheet, Button } from "react-native";

import UpvoteIcon from "@/assets/images/reviews/upvote.svg";
import DownvoteIcon from "@/assets/images/reviews/downvote.svg";
import { IconButton } from "react-native-paper";

type ReviewCardProps = {
  reviews: Review[];
  handleVote: (reviewId: number, upvote: boolean) => void;
};

const TopReview = ({ reviews, handleVote }: ReviewCardProps) => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [reviewUser, setReviewUser] = useState<User | null>(null);
  const topReview = reviews.reduce((maxReview, currentReview) => {
    return currentReview.votes > maxReview.votes ? currentReview : maxReview;
  }, reviews[0]);

  useEffect(() => {
    if (topReview) {
      axios
        .get(`${BASE_URL}/users/${topReview.user_id}`)
        .then((response) => setReviewUser(response.data))
        .catch((error) => console.error(error));
    }
  }, [topReview]);

  // TODO: THE RATINGS SHOULD EVENTUALLY BECOME SOME STARS MAYBE
  return (
    <View>
      <Text style={styles.title}> Top Reviews </Text>
      {reviews.map((review) => (
        <View style={styles.reviewBox} key={review.id}>
          {reviewUser && reviewUser.profile_picture && (
            <Image
              style={styles.image}
              source={{ uri: reviewUser.profile_picture }}
            />
          )}
          <View style={styles.column}>
            <Text>{reviewUser?.display_name}</Text>
            <Text>{reviewUser?.username}</Text>
            <View style={styles.commentContainer}>
              <Text style={styles.ratingText}>Rating: {review.rating}</Text>
              <Text style={styles.commentText}>{review.comment}</Text>
            </View>
            <View style={styles.voteContainer}>
              <IconButton
                onPress={() => handleVote(review.id, true)}
                icon={UpvoteIcon}
              />
              <Text>{review.votes}</Text>
              <IconButton
                onPress={() => handleVote(review.id, false)}
                icon={DownvoteIcon}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default TopReview;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 8,
  },
  reviewBox: {
    backgroundColor: "#D3D3D3",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  column: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  commentContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
  },
  commentText: {
    fontSize: 16,
    color: "#233",
  },
  ratingText: {
    fontSize: 14,
    color: "#555",
  },
  voteContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
});
