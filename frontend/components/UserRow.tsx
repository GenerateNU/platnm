import React from "react";
import { View, Text, Image } from "react-native";
import { toReadableTime } from "@/utils/utils";

type Props = {
  recommendations: RecommendationResponse[];
  currentRecIndex: number;
};

const UserRow = ({ recommendations, currentRecIndex }: Props) => {
  if (
    recommendations.length === 0 ||
    currentRecIndex >= recommendations.length
  ) {
    return <View />;
  }
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#fff",
        padding: 20,
      }}
    >
      <Image
        source={{ uri: recommendations[currentRecIndex].recommender_picture }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <View style={{ marginVertical: "auto" }}>
        <Text
          style={{
            fontSize: 16,
            color: "#000",
            fontWeight: "500",
          }}
        >
          {recommendations[currentRecIndex].recommender_name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#393E46",
            fontWeight: "500",
          }}
        >
          {toReadableTime(
            new Date(recommendations[currentRecIndex].created_at),
          )}
        </Text>
      </View>
    </View>
  );
};

export default UserRow;
