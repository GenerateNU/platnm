import { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions } from "react-native";
import axios from "axios";
import ReviewPreview from "@/components/ReviewPreview";
import Filter from "@/components/search/Filter";

const initialLayout = { width: Dimensions.get("window").width };

export default function SongReviews() {

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const userId = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // Hardcoding - replace dynamically
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Fetch user reviews
    axios
      .get(`${BASE_URL}/reviews/user/${userId}`)
      .then((response) => {
        setUserReviews(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const UserReviewsTab = () => (

    <ScrollView>
      {userReviews.length > 0 ? (
        userReviews.map((review) => (
          <ReviewPreview key={review.id} preview={} />
        ))
      ) : (
        <Text>You haven't reviewed this yet.</Text>
      )}
    </ScrollView>

  );

  return (
    <View style={styles.container}>
      <Filter
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
});
