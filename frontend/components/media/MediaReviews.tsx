import { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import axios from "axios";
import ReviewPreview from "@/components/ReviewPreview";
import Filter from "@/components/search/Filter";

interface MediaReviewProps {
  media_type: MediaType;
  media_id: string;
  filter: "user" | "friend";
}

const TrackReviewsPage = ({media_type, media_id, filter} : MediaReviewProps) => {

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const userId = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // Hardcoding - replace dynamically

  const [userReviews, setUserReviews] = useState<Preview[]>([]);

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(filter);

  const filterOptions = ["user", "friend"]

  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilter(filter);
  };

  useEffect(() => {
    // Fetch user reviews
    axios
    .get(`${BASE_URL}/reviews/${media_id}/${userId}`, {
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
