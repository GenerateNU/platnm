import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface SongChipProps {
  id: number;
  title: string;
  artist_name: string;
  cover: string;
}

const SongChip: React.FC<SongChipProps> = ({
  id,
  title,
  artist_name,
  cover,
}) => {
  console.log(id);
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.id}>{id}.</Text>
      <Image style={styles.cover} source={{ uri: cover }} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artist_name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  id: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 5,
  },
  cover: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
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
