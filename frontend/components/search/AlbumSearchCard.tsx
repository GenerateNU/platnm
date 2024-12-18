import React from "react";
import { router } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface SearchCardProps {
  id: number;
  rank: number;
  artist_name: string;
  album_name: string;
  cover: string;
  type?: string;
}

const SearchCard: React.FC<SearchCardProps> = ({
  id,
  rank,
  artist_name,
  album_name,
  cover,
  type,
}) => {
  const placeholderImage =
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/MediaPage",
          params: {
            mediaType: type,
            mediaId: id,
          },
        })
      }
    >
      <View style={styles.albumContainer}>
        <Text style={styles.rank}>{rank ? `${rank}. ` : ""}</Text>
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: cover || placeholderImage }}
            style={styles.albumCover}
          />
        </View>

        <View style={styles.recordContainer}>
          <Image
            source={require("@/assets/images/Profile/record.png")}
            style={styles.recordImage}
          />
        </View>
      </View>

      <Text style={styles.albumName}>{album_name}</Text>
      <Text style={styles.artistName}>{artist_name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    width: 160,
  },
  albumContainer: {
    flexDirection: "row", // Set horizontal layout to align rank and cover side-by-side
    alignItems: "center", // Align items vertically centered
    position: "relative",
    width: 140,
  },
  rank: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20,
    marginRight: 6,
    marginTop: -85,
  },
  coverContainer: {
    zIndex: 2,
  },
  recordContainer: {
    position: "absolute",
    bottom: 5,
    left: "50%",
    transform: [{ translateX: 0 }],
  },
  recordImage: {
    width: 100,
    height: 100,
  },
  albumCover: {
    width: 110,
    height: 110,
    borderRadius: 8,
  },
  albumName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#434343",
    marginTop: 4,
    textAlign: "left",
    marginLeft: 24,
  },
  artistName: {
    fontSize: 14,
    color: "#434343",
    textAlign: "left",
    marginLeft: 24,
  },
});

export default SearchCard;
