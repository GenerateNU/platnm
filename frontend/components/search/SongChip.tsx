import React from "react";
import { router } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface SongChipProps {
  rank: number;
  id: number;
  title: string;
  artist_name: string;
  cover: string;
}

const SongChip: React.FC<SongChipProps> = ({
  rank,
  id,
  title,
  artist_name,
  cover,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/MediaPage",
          params: {
            mediaType: "track",
            mediaId: id,
          },
        })
      }
    >
      <Text style={styles.id}>{rank}.</Text>
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
