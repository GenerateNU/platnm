import { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import axios from "axios";
import ReviewPreview from "@/components/ReviewPreview";

const initialLayout = { width: Dimensions.get("window").width };

export default function SongReviews() {

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const userId = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // Hardcoding - replace dynamically
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [friendReviews, setOtherReviews] = useState<Review[]>([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "userReviews", title: "Your Reviews" },
    { key: "friendReviews", title: "Friend Reviews" },
  ]);

  useEffect(() => {
    // Fetch user reviews
    axios
      .get(`${BASE_URL}/reviews/user/${userId}`)
      .then((response) => {
        setUserReviews(response.data);
      })
      .catch((error) => console.error(error));

    // TODO: Fetch other reviews

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

  const FriendReviewTab = () => (
    // TODO THIS PART
  );

  const renderScene = SceneMap({
    userReviews: UserReviewsTab,
    friendReviews: FriendReviewTab,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap({
        userReviews: UserReviewsTab,
        friendReviews: FriendReviewTab,
      })}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
});
