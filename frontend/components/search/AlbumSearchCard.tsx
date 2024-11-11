import { useNavigation } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

interface AlbumSearchCardProps {
  id: number;
  rank: number;
  artist_name: string;
  album_name: string;
  cover: string;
}

const AlbumSearchCard: React.FC<AlbumSearchCardProps> = ({
  id,
  rank,
  artist_name,
  album_name,
  cover,
}) => {
  const placeholderImage =
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("MediaPage", {
          mediaType: "album",
          mediaId: id,
        })
      }
    >
      <View style={styles.albumContainer}>
        {/* Rank */}
        <Text style={styles.rank}>{rank}.</Text>

        {/* Album Cover */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: cover || placeholderImage }}
            style={styles.albumCover}
          />
        </View>

        {/* Record Image */}
        <View style={styles.recordContainer}>
          <Image
            source={require("@/assets/images/Profile/record.png")}
            style={styles.recordImage}
          />
        </View>
      </View>

      {/* Album and Artist Name */}
      <Text style={styles.albumName}>{album_name}</Text>
      <Text style={styles.artistName}>{artist_name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "flex-start",
    marginRight: 25,
    marginBottom: 16,
    width: 140,
  },
  albumContainer: {
    flexDirection: "row", // Set horizontal layout to align rank and cover side-by-side
    alignItems: "center", // Align items vertically centered
    position: "relative",
  },
  rank: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20,
    marginRight: 6, // Spacing between rank and cover image
    marginTop: -85,
  },
  coverContainer: {
    zIndex: 2, // Ensure cover is on top
  },
  recordContainer: {
    position: "absolute", // Position record on top of cover
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

export default AlbumSearchCard;
