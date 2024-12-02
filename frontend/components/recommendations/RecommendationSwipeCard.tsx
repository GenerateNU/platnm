import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Play from "@/assets/images/Icons/play.svg";
import Info from "@/assets/images/Icons/info.svg";

export type RecommendationSwipeCardProps = {
  title: string;
  artist: string;
  media_type: string;
  url: string;
};

const RecommendationSwipeCard = ({
  title,
  artist,
  media_type,
  url,
}: RecommendationSwipeCardProps) => {
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
              <Text style={{ color: "white", fontSize: 16 }}>{title}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={{ color: "#fff7", fontSize: 14 }}>{artist}</Text>
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
                  {media_type}
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
};

export default RecommendationSwipeCard;

const styles = StyleSheet.create({
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
  cardBottom: {
    backgroundColor: "rgba(57, 62, 70, 0.70)",
    marginTop: "auto",
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
