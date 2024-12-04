import React from "react";
import { router } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface SongChipProps {
  id: number;
  title: string;
  artist_name: string;
  cover: string;
  rank: number;
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
      style={[styles.container, !rank && styles.noRankContainer]}
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
      {rank && <Text style={styles.rank}>{`${rank}. `}</Text>}
      <Image style={styles.cover} source={{ uri: cover }} />
      <View style={[styles.textContainer, !rank && styles.noRankTextContainer]}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artist_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    paddingVertical: 4,
  },
  noRankContainer: {
    paddingLeft: 8,
  },
  rank: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
    width: 20,
  },
  cover: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
  },
  noRankTextContainer: {
    marginLeft: 8,
  },

  title: {
    fontSize: 13,
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
