import { useState, useEffect } from "react";
import { router } from "expo-router"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ArrowRight from "@/assets/images/Media/arrowRight.svg";
import axios from "axios";

type YourRatingsProps = {
  user_id: string;
  media_id: string;
  media_type: string;
};

const YourRatings = ({ user_id, media_id, media_type }: YourRatingsProps) => {

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [userReviews, setUserReviews] = useState<Preview[]>([]);

  useEffect(() => {
    // Fetch user reviews
    axios
    .get(`${BASE_URL}/reviews/media/${media_id}/${user_id}`, {
      params: {
        media_type: media_type, 
      },
    })      
    .then((response) => {
      setUserReviews(response.data);
    })
    .catch((error) => console.error(error));
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push({
        pathname: "/MediaReviewsPage",
        params: {
          media_id: media_id,
          user_id: user_id,
          media_type: media_type, 
          filter: "user",
        },
      })}
    >
      <View style={styles.textContainer}>
        <Text style={styles.text}>You've rated this song</Text>
        <View style={styles.countBubble}>
          <Text style={styles.countText}>{userReviews.length}x</Text>
        </View>
      </View>
      <ArrowRight />
    </TouchableOpacity>
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
