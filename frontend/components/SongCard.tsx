import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const SongCard = () => {
  const image = require("@/assets/images/placeholder-image.png");
  const [releaseDate, setReleaseDate] = useState(new Date());
  const [songName, setSongName] = useState("Name of Song");
  const [artistName, setArtistName] = useState("Artist Name");

  return (
    <View style={styles.card}>
      <Image source={image} />
      <View style={styles.textContainer}>
        <Text style={styles.releaseDate}>
          {releaseDate.toLocaleDateString()}
        </Text>
        <Text style={styles.songName}>{songName}</Text>
        <Text style={styles.artistName}>{artistName} • Song</Text>
      </View>
      <TouchableOpacity style={styles.seeAlbumButton}>
        <Text style={styles.seeAlbum}>See album</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#A9A9A9",
    padding: 10,
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  releaseDate: {
    color: "#434343",
    marginBottom: 4,
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
