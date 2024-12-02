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

export type RecommendationsCard = {
  media_type: string;
  since: string;
  artist: string;
  title: string;
  url: string;
  id: string;
  media_id: string;
};

type RecommendationResponse = {
  id: number;
  media_type: string;
  media_id: string;
  recommender_id: string;
  recommender_name: string;
  recommendee_id: string;
  created_at: string;
  reaction: boolean;
  artist_name: string;
  title: string;
  recommender_picture: string;
  cover: string;
};

export default function RecommendationsScreen() {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { userId } = useAuthContext();
  const [recommendations, setRecommendations] = useState<RecommendationsCard[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_URL}/recommendation/${userId}`,
        );

        if (response.data) {
          setRecommendations(
            response.data.map((recommendation: RecommendationResponse) => {
              return {
                media_type: recommendation.media_type,
                since: recommendation.created_at,
                artist: recommendation.artist_name,
                title: recommendation.title,
                url: recommendation.cover,
                id: recommendation.id,
                recomender_name: recommendation.recommender_name,
                recommender_picture: recommendation.recommender_picture,
                media_id: recommendation.media_id,
              };
            }),
          );
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reccomendation:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const reactToRecommendation = (id: string, reaction: boolean) => {
    axios.patch(`${BASE_URL}/recommendation/${id}`, {
      reaction: reaction,
      user_id: userId,
    });
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
      <UserRow recomendations={recommendations} />
      <View
        style={{
          height: Dimensions.get("window").height * 0.4,
        }}
      >
        <SwipeCards
          handleYup={(card: RecommendationsCard) => {
            reactToRecommendation(card.id, true);
            addToQueue(card.media_type, card.media_id);
          }}
          handleNope={(card: RecommendationsCard) =>
            reactToRecommendation(card.id, false)
          }
          cards={recommendations}
          renderCard={({
            artist,
            title,
            media_type,
            url,
          }: RecommendationsCard) => {
            return (
              <RecommendationSwipeCard
                artist={artist}
                title={title}
                media_type={media_type}
                url={url}
              />
            );
          }}
        />
      </View>
      <View style={styles.reactButtonWrapper}>
        <RatingButton icon={"cross"} />
        <RatingButton icon={"heart"} />
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
