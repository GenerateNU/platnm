import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import ReviewPreview from "@/components/ReviewPreview";
import Filter from "@/components/search/Filter";

interface MediaReviewProps {
  userReviews: Preview[]
  filter: "user" | "friend";
}

const MediaReviewsPage = ({userReviews, filter} : MediaReviewProps) => {

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(filter);

  const filterOptions = ["user", "friend"]

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