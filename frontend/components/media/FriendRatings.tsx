import React from "react";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import ArrowRight from "@/assets/images/Media/arrowRight.svg";
import axios from "axios";
import { useAuthContext } from "../AuthProvider";



type FriendRatingsProps = {
  media_id: string;
  media_type: string,
};



const FriendRatings = ({  media_id, media_type }: FriendRatingsProps) => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [friendsReviews, setFriendsReviews] = useState<Preview[]>([]);
  const { userId } = useAuthContext();

  useEffect(() => {
    axios
    .get(`${BASE_URL}/social/${media_type}/${media_id}`, {
      params: {
        userid: userId,
      },
    })
    .then((response) => setFriendsReviews(response.data))
    .catch((error) => console.error(error));
}, []);
   
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/MediaReviewsPage",
          params: {
            media_id: media_id,
            user_id: userId,
            media_type: media_type,
            filter: "friend",
          },
        })
      }
  >
      <View style={styles.textContainer}>
        <Text style={styles.text}>Reviewed by</Text>
        <View style={styles.countBubble}>
          <Text style={styles.countText}>{friendsReviews?.length ?? 0}x friends</Text>
        </View>
      </View>
      <ArrowRight />
    </TouchableOpacity>
  );
};

export default FriendRatings;

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
