import { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import ReviewPreview from "@/components/ReviewPreview";
import Filter from "@/components/search/Filter";
import axios from "axios";

interface MediaReviewProps {
  media_id: string, 
  user_id: string,
  media_type: string,
  filter: "user" | "friend";
}

const MediaReviewsPage = ({media_id, user_id, media_type, filter} : MediaReviewProps) => {

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(filter);
  const [userReviews, setUserReviews] = useState<Preview[]>([])

  const filterOptions = ["user", "friend"]

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    // Fetch user reviews
    axios
    .get(`${BASE_URL}/reviews/${media_id}/${user_id}`, {
      params: {
        media_type: media_type, 
      },
    })      
    .then((response) => {
      setUserReviews(response.data);
    })
    .catch((error) => console.error(error));
  }, []);

  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilter(filter);
  };

  return (
    <View style={styles.container}>
      <Filter
        currentFilter={selectedFilter}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
      <View>
      {selectedFilter === "user" && (
        <View>
          <Text>User Reviews</Text>
          {userReviews.map((review, index) => {
            return <ReviewPreview key={index} preview={review} />;
          })}
        </View>
      )}
      {selectedFilter === "friend" && (
        <View></View> 
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
});

export default MediaReviewsPage