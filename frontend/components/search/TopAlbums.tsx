import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AlbumSearchCard from "@/components/search/AlbumSearchCard";
import { ScrollView } from "react-native";

type AlbumCardProps = {
  albums: MediaResponse[];
};

const TopAlbums = ({ albums }: AlbumCardProps) => {
  return (
    <View>
      <Text style={styles.title}>Top Albums</Text>

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
            artist_name={album.media.artist_name}
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
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 28,
    paddingBottom: 12,
    paddingTop: 32,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  songName: {
    fontSize: 18,
    fontWeight: 500,
    color: "#000",
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
