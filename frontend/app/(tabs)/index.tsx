import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import axios from "axios";
import ReviewPreview from "@/components/ReviewPreview";
import Icon from "react-native-vector-icons/Feather";
import { router, useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

export default function HomeScreen() {
  //const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const BASE_URL = "https://tqjwyhqmpmdjigoyjnrr.supabase.co";

  const [feedReviews, setFeedReviews] = useState<Preview[]>();
  const userId = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // Hardcoding - Get userId from navigation
  const hasNotification = true; // Hardcoding - Get notification status from somewhere else
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    const fetchFeedReviews = async () => {
      console.log("fetchFeedReviews");
      try {
        const response = await axios.get(`${BASE_URL}/users/feed/${userId}`);
        setFeedReviews(response.data);
      } catch (error) {
        console.error("Error fetching feed reviews:", error);
      }
    };

    fetchFeedReviews();
  }, []);

  const handleNotifPress = () => {
    console.log("Notif icon pressed");
    // Add activity icon press handling logic here
  };

  const handleMusicPress = () => {
    console.log("music icon pressed");
    navigation.navigate("Recommendations");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Top icons */}
        <View style={styles.topIconsContainer}>
          {/* Activity icon with notification badge */}
          <Text style={[styles.titleContainer, styles.titleText]}>
            <ThemedText type="title" style={styles.titleText}>
              Platnm
            </ThemedText>
          </Text>

          {/* Grouping the settings and share icons on the right */}
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
              return (
                console.log("Review: ", review),
                (<ReviewPreview key={index} preview={review} />)
              );
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
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  noReviewsText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
  titleText: {
    color: "#F28037",
    fontSize: 24, // Adjust font size if needed
    fontWeight: "bold",
  },
});
