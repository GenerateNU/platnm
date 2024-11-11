import { useState, useEffect } from "react";

import { StyleSheet, Touchable } from "react-native";

import UserRow from "@/components/UserRow";
import { View } from "react-native";
import { SubpageHeader } from "@/components/SubpageHeader";
import { Dimensions } from "react-native";
import { Text } from "react-native";
import { RatingButton } from "@/components/RatingButton";
import SwipeCards from "react-native-swipe-cards";
import { ImageBackground } from "react-native";
import axios from "axios";

import Play from "@/assets/images/Icons/play.svg";
import Info from "@/assets/images/Icons/info.svg";
import { TouchableOpacity } from "react-native";
import { useAuthContext } from "@/components/AuthProvider";
import HeaderComponent from "@/components/HeaderComponent";

export type RecommendationsCard = {
  songType: string;
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

  const [reccomendations, setRecommendations] = useState<RecommendationsCard[]>(
    [],
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/recommendation/${userId}`,
        );

        if (response.data) {
          setRecommendations(
            response.data.map((recommendation: RecommendationResponse) => {
              return {
                songType: recommendation.media_type,
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
      } catch (error) {
        console.error("Error fetching reccomendation:", error);
      }
    };
    console.log("rerunning");
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {}, [reccomendations]);

  const reactToRecommendation = (id: string, reaction: boolean) => {
    console.log("reactToRecommendation");
    axios.patch(`${BASE_URL}/recommendation/${id}`, {
      reaction: reaction,
      user_id: userId,
    });
  };

  const addToQueue = async (id: string) => {
    // need to pass the track itself not just the id
    const { data } = await axios.get(`${BASE_URL}/media/track/${id}`);
    console.log("track");
    console.log(data);
    const add = await axios.post(`${BASE_URL}/playlist/${userId}`, {
      ...data,
    });
    console.log("add");
    console.log(add);
  };
  return (
    <View
      style={{
        backgroundColor: "#fff",
        minHeight: Dimensions.get("window").height,
      }}
    >
      <HeaderComponent title="Recommendations" />
      <UserRow recomendations={reccomendations} />
      <View
        style={{
          height: Dimensions.get("window").height * 0.4,
        }}
      >
        <SwipeCards
          handleYup={(card: RecommendationsCard) => {
            console.log("yup!");
            reactToRecommendation(card.id, true);
            addToQueue(card.media_id);
          }}
          handleNope={(card: RecommendationsCard) =>
            reactToRecommendation(card.id, false)
          }
          cards={reccomendations}
          renderCard={({
            artist,
            title,
            songType,
            url,
          }: RecommendationsCard) => {
            return (
              <View
                style={{
                  borderRadius: 16,
                }}
              >
                <View style={styles.swipeContainer} />
                <ImageBackground
                  source={{ uri: url }}
                  imageStyle={{
                    borderRadius: 16,
                  }}
                  style={styles.swipeCard}
                >
                  <View style={styles.cardBottom}>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ padding: 20 }}>
                        <Text style={{ color: "white", fontSize: 16 }}>
                          {title}
                        </Text>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                          <Text style={{ color: "#fff7", fontSize: 14 }}>
                            {artist}
                          </Text>
                          <View
                            style={{
                              width: 5,
                              height: 5,
                              backgroundColor: "#fff7",
                              borderRadius: 50,
                              marginVertical: "auto",
                            }}
                          />
                          <Text style={{ color: "#fff7", fontSize: 14 }}>
                            {songType}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity style={{ marginLeft: "25%" }}>
                        <Play
                          width={32}
                          height={32}
                          style={{ color: "white", margin: "auto" }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Info
                          width={32}
                          height={32}
                          style={{
                            color: "white",
                            margin: "auto",
                            marginLeft: 10,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              </View>
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
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  swipeContainer: {
    backgroundColor: "#D1D5DD",
    borderRadius: 16,
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.4,

    position: "absolute",
  },
  swipeCard: {
    width: Dimensions.get("window").width * 0.85,
    height: Dimensions.get("window").height * 0.4,
    marginHorizontal: "auto",
  },
  reactButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    flexDirection: "row",
    gap: 32,
  },
  cardBottom: {
    backgroundColor: "rgba(57, 62, 70, 0.70)",
    marginTop: "auto",
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
