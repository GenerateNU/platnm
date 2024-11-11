import React from "react";
import { useState } from "react";

//"Import SongChip from @/components/SongChip" where?
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import AlbumSearchCard from "@/components/search/AlbumSearchCard";
import { ScrollView } from "react-native";

type AlbumCardProps = {
  albums: MediaResponse[];
};

const TopAlbums = ({ albums }: AlbumCardProps) => {
  const image =
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";

  return (
    <View>
      <Text style={styles.title}>Your Top Albums</Text>

      <ScrollView
        horizontal
        style={styles.container}
        showsHorizontalScrollIndicator={false}
      >
        {albums?.map((album, index) => (
          <AlbumSearchCard
            key={album.media.id}
            id={album.media.id}
            rank={index + 1}
            artist_name={album.media.artist_name} // hardcoded
            album_name={album.media.title}
            cover={album.media.cover}
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
  container: {
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  songName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#434343",
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#434343",
    marginBottom: 4,
  },
});

export default TopAlbums;
