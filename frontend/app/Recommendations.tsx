import { useState, useEffect } from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";
import axios from "axios";
import SwipeCards from "react-native-swipe-cards";

import UserRow from "@/components/UserRow";
import { RatingButton } from "@/components/RatingButton";
import { useAuthContext } from "@/components/AuthProvider";
import HeaderComponent from "@/components/HeaderComponent";

import NoRecommendations from "@/components/recommendations/NoRecommendations";
import RecommendationSwipeCard from "@/components/recommendations/RecommendationSwipeCard";

export default function RecommendationsScreen() {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { userId } = useAuthContext();
  const [recommendations, setRecommendations] = useState<
    RecommendationResponse[]
  >([]);
  const [currentRecIndex, setCurrentRecIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_URL}/recommendation/${userId}`,
        );

        if (response.data) {
          setRecommendations(response.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reccomendation:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const reactToRecommendation = (id: number, reaction: boolean) => {
    setCurrentRecIndex((prev) => prev + 1);
    // axios.patch(`${BASE_URL}/recommendation/${id}`, {
    //   reaction: reaction,
    //   user_id: userId,
    // });
  };

  const addToQueue = async (mediaType: string, id: string) => {
    // TODO: TBD on handling of albums when it comes to recs/on_queue
    if (mediaType === "track") {
      const { data } = await axios.get(`${BASE_URL}/media/track/${id}`);
      await axios.post(`${BASE_URL}/playlist/on_queue/${userId}`, {
        ...data,
      });
    }
  };

  if (isLoading) {
    return <Text style={styles.loadingText}>Searching...</Text>;
  }

  if (!isLoading && recommendations.length === 0) {
    return <NoRecommendations />;
  }

  return (
    <View style={styles.container}>
      <HeaderComponent title="Recommendations" />
      <UserRow
        recommendations={recommendations}
        currentRecIndex={currentRecIndex}
      />
      <View
        style={{
          height: Dimensions.get("window").height * 0.4,
        }}
      >
        <SwipeCards
          handleYup={(card: RecommendationResponse) => {
            reactToRecommendation(card.id, true);
            addToQueue(card.media_type, card.media_id);
          }}
          handleNope={(card: RecommendationResponse) =>
            reactToRecommendation(card.id, false)
          }
          cards={recommendations}
          renderCard={(card: RecommendationResponse) => {
            return <RecommendationSwipeCard card={card} />;
          }}
        />
      </View>
      {/* TODO: BUTTONS ARE NOT FUNCTIONAL */}
      <View style={styles.reactButtonWrapper}>
        <RatingButton icon={"cross"} handlePress={() => console.log("hit X")} />
        <RatingButton
          icon={"heart"}
          handlePress={() => console.log("hit like")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    minHeight: Dimensions.get("window").height,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666666",
  },
  reactButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    flexDirection: "row",
    gap: 32,
  },
});
