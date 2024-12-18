import React from "react";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ArrowRight from "@/assets/images/Media/arrowRight.svg";
import axios from "axios";
import { useAuthContext } from "../AuthProvider";

type YourRatingsProps = {
  media_id: string;
  media_type: string;
};

const YourRatings = ({ media_id, media_type }: YourRatingsProps) => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [userReviews, setUserReviews] = useState<Preview[]>([]);
  const { userId } = useAuthContext();

  useEffect(() => {
    if (userId)
      axios
        .get(`${BASE_URL}/reviews/media/${media_id}/${userId}`, {
          params: {
            media_type: media_type,
          },
        })
        .then((response) => setUserReviews(response.data))
        .catch((error) => console.error(error));
  }, []);

  return (
    userId && (
      <TouchableOpacity
        style={styles.container}
        disabled={!userReviews || userReviews.length === 0}
        onPress={() =>
          router.push({
            pathname: "/MediaReviewsPage",
            params: {
              media_id: media_id,
              user_id: userId,
              media_type: media_type,
              filter: "you",
            },
          })
        }
      >
        <View style={styles.textContainer}>
          <Text style={styles.text}>You've rated this {media_type}</Text>
          <View style={styles.countBubble}>
            <Text style={styles.countText}>{userReviews?.length ?? 0}x</Text>
          </View>
        </View>
        {userReviews && userReviews.length > 0 && <ArrowRight />}
      </TouchableOpacity>
    )
  );
};

export default YourRatings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  text: {
    fontFamily: "NeueHaasUnicaPro-Bold",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "bold",
  },
  countBubble: {
    backgroundColor: "#000",
    borderRadius: 20,
  },
  countText: {
    color: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
