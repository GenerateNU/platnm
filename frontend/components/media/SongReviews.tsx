// import { useState, useEffect } from "react";
// import { StyleSheet, View, Text, ScrollView } from "react-native";
// import axios from "axios";
// import ReviewPreview from "@/components/ReviewPreview";
// import Filter from "@/components/search/Filter";

// interface SearchResultsProps {
//   media_type: MediaType;
//   media: Media;
//   filter: "user" | "friend";
// }

// const TrackReviewsPage: React.FC = () => {

//   const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
//   const userId = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // Hardcoding - replace dynamically
//   const [userReviews, setUserReviews] = useState<Review[]>([]);

//   const [selectedFilter, setSelectedFilter] = useState<FilterOption>("user");

//   const handleFilterChange = (filter: FilterOption) => {
//     setSelectedFilter(filter);
//   };

//   useEffect(() => {
//     // Fetch user reviews
//     axios
//       .get(`${BASE_URL}/reviews/user/${userId}`)
//       .then((response) => {
//         setUserReviews(response.data);
//       })
//       .catch((error) => console.error(error));
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Filter
//         currentFilter={selectedFilter}
//         onFilterChange={handleFilterChange}
//       />
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 80,
//   },
// });
