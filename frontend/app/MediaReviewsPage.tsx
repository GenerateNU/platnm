import React from "react";
import { useState, useEffect } from "react";
import { View, ScrollView, Image, Text } from "react-native";
import ReviewPreview from "@/components/ReviewPreview";
import Filter from "@/components/search/Filter";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import HeaderComponent from "@/components/HeaderComponent";
import Vinyl from "@/assets/images/media-vinyl.svg";
import { StyleSheet } from "react-native";

const MediaReviewsPage = () => {
  const { media_id, user_id, media_type, filter } = useLocalSearchParams<{
    media_id: string;
    user_id: string;
    media_type: string;
    filter: string;
  }>();

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(filter);
  const [userReviews, setUserReviews] = useState<Preview[]>([]);
  const [friendsReviews, setFriendsReviews] = useState<Preview[]>([]);
  const [allReviews, setAllReviews] = useState<Preview[]>([]);
  const [mediaStats, setMediaStats] = useState<{
    userScore: number;
    userRatings: number;
    friendScore: number;
    friendRatings: number;
    avgScore: Number;
    totalRatings: number;
  }>({
    userScore: 0,
    userRatings: 0,
    friendScore: 0,
    friendRatings: 0,
    avgScore: 0,
    totalRatings: 0,
  });
  const [mediaCover, setMediaCover] = useState<string | null>(null);

  const filterOptions = ["you", "friend", "all"];

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/reviews/${media_type}/${media_id}`,
        );
        setAllReviews(response.data.reviews);

        setMediaStats((prev) => ({
          ...prev,
          avgScore: response.data.avgRating || 0,
          totalRatings: response.data.totalCount || 0,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMediaCover = async () => {
      axios
        .get(`${BASE_URL}/media/${media_type}/${media_id}`)
        .then((response) => {
          setMediaCover(response.data.cover);
        })
        .catch((error) => console.error(error));
    };

    const fetchUserReviews = async () => {
      // Fetch user reviews
      try {
        const response = await axios.get(
          `${BASE_URL}/reviews/media/${media_id}/${user_id}`,
          {
            params: {
              media_type: media_type,
            },
          },
        );

        const reviews = response.data;
        setUserReviews(reviews);

        // Calculate the average score
        const totalScore = response.data.reduce(
          (sum: any, review: { rating: any }) => sum + review.rating,
          0,
        ); // Sum of all ratings
        const averageScore =
          reviews.length > 0 ? totalScore / reviews.length : 0; // Avoid division by 0
        // Update userScore in mediaStats
        setMediaStats((prev) => ({
          ...prev,
          userScore: averageScore,
          userRatings: reviews.length,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFriendReviews = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/reviews/media/${media_id}/${user_id}/following`,
          {
            params: {
              media_type: media_type,
            },
          },
        );

        const reviews = response.data;
        if (reviews) {
          setFriendsReviews(reviews);

          // Calculate the average score
          const totalScore = reviews.reduce(
            (sum: any, review: { rating: any }) => sum + review.rating,
            0,
          ); // Sum of all ratings
          const averageScore =
            reviews.length > 0 ? totalScore / reviews.length : 0; // Avoid division by 0

          // Update userScore in mediaStats
          setMediaStats((prev) => ({
            ...prev,
            friendScore: averageScore,
            friendRatings: reviews.length,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriendReviews();
    fetchAll();
    fetchMediaCover();
    fetchUserReviews();
  }, []);

  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilter(filter);
  };

  const formatLargeNumber = (number: number) => {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K"; // Convert to K with 1 decimal place
    }
    return number.toString(); // Return as is for numbers below 1000
  };

  return (
    <View>
      <ScrollView style={{ backgroundColor: "#FFF" }}>
        <HeaderComponent title="" />
        <View style={styles.headerContainer}>
          <View style={styles.vinylContainer}>
            <Vinyl style={styles.vinyl} />
            {mediaCover && (
              <Image
                source={{ uri: mediaCover }}
                style={styles.mediaCover}
                resizeMode="cover"
              />
            )}
          </View>
          <View style={styles.statsContainer}>
            {selectedFilter === "you" && (
              <View style={styles.scoreContainer}>
                <Text style={styles.score}>
                  {mediaStats.userScore.toFixed(1)}
                </Text>
                <Text style={styles.scoreLabel}>Your Avg Rating</Text>
              </View>
            )}
            {selectedFilter === "friend" && (
              <View style={styles.scoreContainer}>
                <Text style={styles.score}>
                  {mediaStats.friendScore.toFixed(1)}
                </Text>
                <Text style={styles.scoreLabel}>Friend Rating</Text>
              </View>
            )}
            {selectedFilter === "all" && (
              <View style={styles.scoreContainer}>
                <Text style={styles.score}>
                  {mediaStats.avgScore.toFixed(1)}
                </Text>
                <Text style={styles.scoreLabel}>Avg Rating</Text>
              </View>
            )}
            {selectedFilter === "you" && (
              <>
                <Text style={styles.totalRatings}>
                  {formatLargeNumber(mediaStats.userRatings)}
                </Text>
                <Text style={styles.totalRatingsText}>Your Ratings</Text>
              </>
            )}
            {selectedFilter === "friend" && (
              <>
                <Text style={styles.totalRatings}>
                  {formatLargeNumber(mediaStats.friendRatings)}
                </Text>
                <Text style={styles.totalRatingsText}>Friends Ratings</Text>
              </>
            )}
            {selectedFilter === "all" && (
              <>
                <Text style={styles.totalRatings}>
                  {formatLargeNumber(mediaStats.totalRatings)}
                </Text>
                <Text style={styles.totalRatingsText}>Total Ratings</Text>
              </>
            )}
          </View>
        </View>
        <Filter
          currentFilter={selectedFilter}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />
        <View>
          {selectedFilter === "you" && (
            <View style={styles.reviews}>
              {userReviews.map((review, index) => {
                return <ReviewPreview key={index} preview={review} />;
              })}
            </View>
          )}
          {selectedFilter === "friend" && (
            <View>
              {friendsReviews &&
                friendsReviews.length > 0 &&
                friendsReviews.map((review, index) => {
                  return <ReviewPreview key={index} preview={review} />;
                })}
            </View>
          )}
          {selectedFilter === "all" && (
            <View style={styles.reviews}>
              {allReviews.map((review, index) => {
                return <ReviewPreview key={index} preview={review} />;
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    overflow: "hidden",
    height: 180,
  },
  vinylContainer: {
    width: "50%",
  },
  vinyl: {
    width: 100,
    height: 100,
    marginLeft: -60,
    marginTop: -130,
    shadowColor: "#FF6D00", // Orange shadow
    shadowOffset: { width: 5, height: 5 }, // Offset for iOS
    shadowOpacity: 0.8, // Opacity for iOS
    shadowRadius: 6, // Blur radius for iOS
    elevation: 10,
  },
  mediaCover: {
    width: 113,
    height: 113,
    borderRadius: 60,
    overflow: "hidden",
    marginLeft: -5,
    marginTop: -194,
  },
  statsContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: -50,
  },
  scoreContainer: {
    alignItems: "center",
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F28037",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#F28037",
    marginTop: 4,
  },
  totalRatingsText: {
    fontSize: 14,
    color: "#424242",
    marginTop: 8,
  },
  totalRatings: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#424242",
    marginTop: 15,
  },
  reviewsContainer: {
    backgroundColor: "#fff",
  },
  reviews: {
    width: "90%",
    alignSelf: "center",
  },
});

export default MediaReviewsPage;
