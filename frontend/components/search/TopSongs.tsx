import { useState, useCallback } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import SongChip from "@/components/search/SongChip";

type SongCardProp = {
  songs: MediaResponse[];
};
const TopSongs = ({ songs }: SongCardProp) => {
  return (
    <View>
      <Text style={styles.title}>Your Top Tracks</Text>
      <ScrollView horizontal={true}>
        {songs?.map((song, id) => (
          <SongChip 
          id={id+1}
          title={song.media.title}
          artist_name={"TEst"}
          cover={song.media.cover}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  trackContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  trackName: {
    fontSize: 18,
    fontWeight: "600",
  },
  artistName: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  albumName: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
});

export default TopSongs;
