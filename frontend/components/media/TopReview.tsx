import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import axios from "axios";

type ReviewCardProps = {
  reviews: Review[];
};

const TopReview = ({ reviews }: ReviewCardProps) => {
  const getTopReview = (reviews: Review[]): Review => {
    let topReview: Review = reviews[0];
    // TODO: NEEDS BACKEND FUNCTION TO CALCULATE THE UPVOTES/DOWNVOTES OF A REVIEW, HERE IT WOULD RETURN THE REVIEW WITH THE HIGHEST UPVOTES. BELOW CODE IS A PLACEHOLDER
    return topReview;
  };

  const topReview: Review = getTopReview(reviews);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [reviewUser, setReviewUser] = useState<User | null>(null);

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
      <View style={styles.reviewBox}>
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
            <Text style={styles.ratingText}>Rating: {topReview.rating}</Text>
            <Text style={styles.commentText}>{topReview.comment}</Text>
          </View>
        </View>
      </View>
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
});
