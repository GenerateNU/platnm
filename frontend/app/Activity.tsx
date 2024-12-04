import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuthContext } from "@/components/AuthProvider";
import ReviewPreview from "@/components/ReviewPreview";
import Icon from "react-native-vector-icons/Ionicons";

const Activity = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [userReviews, setUserReviews] = useState<Preview[]>();
  const loggedInUser = useAuthContext().userId;
  const { userId } = useLocalSearchParams<{
    userId: string;
  }>();

  const handleDraftPress = () => {
    console.log("Draft Button pressed");
    // Add activity icon press handling logic here
  };

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/reviews/user/${userId}`);
        setUserReviews(response.data);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    if (userId) fetchUserReviews();
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backContainer}
        >
          <Icon name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Activity</Text>
        </View>
      </SafeAreaView>

      {/* Draft Button */}
      {loggedInUser === userId && (
        <TouchableOpacity style={styles.draftButton} onPress={handleDraftPress}>
          <Text style={styles.draftButtonText}>Drafts</Text>
        </TouchableOpacity>
      )}

      {/* User Reviews Section */}
      {userReviews && userReviews.length > 0 ? (
        userReviews.map((review, index) => {
          return <ReviewPreview key={index} preview={review} />;
        })
      ) : (
        <Text style={styles.noReviewsText}>No reviews found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  draftButton: {
    backgroundColor: "#ff7f00",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 15,
    marginBottom: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  draftButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  backContainer: {
    paddingRight: 15,
    color: "#B7B6B6",
    fontSize: 16,
    marginLeft: 20,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center", // Center horizontally
    left: -30,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noReviewsText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
});

export default Activity;
