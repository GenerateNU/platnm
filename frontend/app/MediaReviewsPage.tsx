import { useState, useEffect } from "react";
import { View, ScrollView, Image, Text } from "react-native";
import ReviewPreview from "@/components/ReviewPreview";
import Filter from "@/components/search/Filter";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import HeaderComponent from "@/components/HeaderComponent";
import Vinyl from "@/assets/images/media-vinyl.svg";

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
  const [mediaStats, setMediaStats] = useState<{ userScore: number; friendScore: number; avgScore: Number; totalRatings: number }>({
    userScore: 0,
    friendScore: 0,
    avgScore: 0,
    totalRatings: 0,
  });
  const [mediaCover, setMediaCover] = useState<string | null>(null);

  const filterOptions = ["you", "friend"];

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        console.log(`${BASE_URL}/reviews/${media_type}/${media_id}`);
        const response = await axios.get(`${BASE_URL}/reviews/${media_type}/${media_id}`);
        console.log(response.data);
        setAllReviews(response.data.reviews);
        setMediaStats({
          userScore: 4.2,
          friendScore: mediaStats.friendScore,
          avgScore: response.data.avgRating || 0,
          totalRatings: response.data.totalCount || 0,
        });
      } catch (error) {
        console.error(error);
      }
    }

    const fetchMediaCover = async () => {
      axios
        .get(`${BASE_URL}/media/${media_type}/${media_id}`)
        .then((response) => {
          setMediaCover(response.data.cover);
        })
        .catch((error) => console.error(error));
    }
    
    const fetchUserReviews = async () => {
    // Fetch user reviews
    try {
      const response = await axios.get(`${BASE_URL}/reviews/media/${media_id}/${user_id}`, {
        params: {
          media_type: media_type,
        },
      });
  
      const reviews = response.data;
      setUserReviews(reviews);
  
      // Calculate the average score
      const totalScore = reviews.reduce((sum: any, review: { rating: any; }) => sum + review.rating, 0); // Sum of all ratings
      const averageScore = reviews.length > 0 ? totalScore / reviews.length : 0; // Avoid division by 0
  
      // Update userScore in mediaStats
      setMediaStats((prevStats) => ({
        ...prevStats,
        userScore: averageScore,
      }));
    } catch (error) {
      console.error(error);
    }
    }

    // TODO ALEX: Here you would also fetch the reviews from friends

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
            <View style={styles.scoreContainer}><Text style={styles.score}>{mediaStats.userScore.toFixed(1)}</Text><Text style={styles.scoreLabel}>Your Avg Score</Text></View>
          )}
          {selectedFilter === "friend" && (
            <View style={styles.scoreContainer}><Text style={styles.score}>{mediaStats.friendScore.toFixed(1)}</Text><Text style={styles.scoreLabel}>Friend Score</Text></View>
          )}
          <Text style={styles.totalRatings}>{formatLargeNumber(mediaStats.totalRatings)}</Text>
          <Text style={styles.totalRatingsText}>Total Ratings</Text>
        </View>
      </View>
        <Filter
          currentFilter={selectedFilter}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />
        <View>
          {selectedFilter === "you" && (
            <View>
              {userReviews.map((review, index) => {
                return <ReviewPreview key={index} preview={review} />;
              })}
            </View>
          )}
          {selectedFilter === "friend" && (
            <View></View> // TODO ALEX: Map each fetched review to a ReviewPreview component which will take care of the rest
          )}
        </View>
      </ScrollView>
    </View>
  );
};

import { StyleSheet } from "react-native";

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
});

export default MediaReviewsPage;
