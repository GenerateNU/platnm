import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface SongChipProps {
  id: number;
  title: string;
  artist_name: string;
  album_name: string;
  cover: string;
}

const SongChip: React.FC<SongChipProps> = ({
  id,
  title,
  artist_name,
  album_name,
  cover,
}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artist_name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 12,
  },
  cover: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#e0e0e0", // placeholder color while image loads
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },
  artist: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
});

export default SongChip;
