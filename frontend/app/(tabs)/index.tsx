import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { useAuthContext } from "@/components/AuthProvider";
import ReviewPreview from "@/components/ReviewPreview";
import { ThemedText } from "@/components/ThemedText";

import Icon from "react-native-vector-icons/Feather";
const logo = require("@/assets/images/icon.png");

export default function HomeScreen() {
  const [feedReviews, setFeedReviews] = useState<Preview[]>();
  const { userId } = useAuthContext();
  const hasNotification = true; // Hardcoding - Get notification status from somewhere else
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const fetchFeedReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/feed/${userId}`);
      setFeedReviews(response.data);
    } catch (error) {
      console.error("Error fetching feed reviews:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) fetchFeedReviews();
    }, [userId]),
  );

  const handleNotifPress = () => {
    router.push("/Notifications");
  };

  const handleMusicPress = () => router.push("/Recommendations");
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topIconsContainer}>
          <Text style={styles.titleContainer}>
            <Image source={logo} style={styles.reactLogo} />
            <View style={styles.title}>
              <ThemedText type="title" style={styles.titleText}>
                Platnm
              </ThemedText>
            </View>
          </Text>

          <View style={styles.rightIconsContainer}>
            <TouchableOpacity
              onPress={handleNotifPress}
              style={styles.rightIcon}
            >
              <Icon
                name="bell"
                size={24}
                color="#000"
                style={styles.rightIcon}
              />
              {hasNotification && <View style={styles.notificationBadge} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleMusicPress}
              style={styles.rightIcon}
            >
              <Icon
                name="music"
                size={24}
                color="#000"
                style={styles.rightIcon}
              />
              {hasNotification && <View style={styles.notificationBadge} />}
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {feedReviews && feedReviews.length > 0 ? (
            feedReviews.map((review, index) => {
              return <ReviewPreview key={index} preview={review} />;
            })
          ) : (
            <Text style={styles.noReviewsText}>No reviews found.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  topIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    paddingTop: 20,
    marginRight: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightIcon: {
    margin: 7,
    padding: 0,
    backgroundColor: "#F0F0F0",
    borderRadius: 50,
  },
  activityIconContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "red",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    marginTop: 5,
    width: 42,
    height: 45,
  },
  noReviewsText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
  title: {
    paddingBottom: 8,
    paddingLeft: 8,
  },
  titleText: {
    color: "#F28037",
    fontSize: 24, // Adjust font size if needed
    fontWeight: "bold",
  },
});
