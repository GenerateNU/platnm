import { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface SongCardProps {
  mediaName: string;
  mediaType: string;
  artistName: string;
  cover: string;
}

const SongCard: React.FC<SongCardProps> = ({
  mediaName,
  mediaType,
  artistName,
  cover,
}: SongCardProps) => {
  // const image = require("@/assets/images/placeholder-image.png");
  const image =
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";

  return (
    <View style={styles.card}>
      <Image
        width={150}
        height={150}
        source={{
          uri: image,
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.songName}>{mediaName}</Text>
        <Text style={styles.artistName}>
          {mediaType} • {artistName}
        </Text>
      </View>
      {/* <TouchableOpacity style={styles.seeAlbumButton}>
        <Text style={styles.seeAlbum}>See album</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 8,
    // backgroundColor: "#A9A9A9",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 10,
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  songName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#434343",
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    color: "#434343",
    marginBottom: 8,
  },
  seeAlbumButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  seeAlbum: {
    color: "#B7B6B6",
    textDecorationLine: "underline",
  },
});

export default SongCard;
