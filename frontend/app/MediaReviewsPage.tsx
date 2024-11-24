import { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import ReviewPreview from "@/components/ReviewPreview";
import Filter from "@/components/search/Filter";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import HeaderComponent from "@/components/HeaderComponent";

const MediaReviewsPage = () => {

  const { media_id, user_id, media_type, filter } =
  useLocalSearchParams<{
    media_id: string,
    user_id: string,
    media_type: string,
    filter: string
  }>();

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(filter);
  const [userReviews, setUserReviews] = useState<Preview[]>([])
  const [friendsReviews, setFriendsReviews] = useState<Preview[]>([])

  const filterOptions = ["user", "friend"]

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

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

    // TODO ALEX: Here you would also fetch the reviews from friends
  }, []);

  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilter(filter);
  };

  return (
    <ScrollView style={{ backgroundColor: "#FFF" }}>
      <HeaderComponent title="" />
      <Filter
        currentFilter={selectedFilter}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
      <View>
      {selectedFilter === "user" && (
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
  );
}

export default MediaReviewsPage