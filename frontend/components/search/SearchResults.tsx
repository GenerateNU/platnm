import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import SongChip from "@/components/search/SongChip";
import AlbumSearchCard from "@/components/search/AlbumSearchCard";

interface SearchResultsProps {
  songs: Media[];
  albums: Media[];
  isLoading: boolean;
  filter: "all" | "songs" | "albums";
}

const SearchResults: React.FC<SearchResultsProps> = ({
  songs,
  albums,
  isLoading,
  filter,
}) => {
  if (isLoading) {
    return <Text style={styles.loadingText}>Searching...</Text>;
  }

  if (songs.length === 0 && albums.length === 0) {
    return <Text style={styles.noResults}>No results found</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.resultsText}>Results</Text>
        <View style={styles.underline} />
      </View>
      <View style={styles.albumsGrid}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          {albums.map((album, index) => (
            <AlbumSearchCard
              id={album.id}
              key={album.id}
              rank={index + 1}
              artist_name={album.artist_name}
              album_name={album.title}
              cover={album.cover}
            />
          ))}
          <View />
          {(filter === "all" || filter === "songs") && (
            <View style={styles.songsList}>
              {songs.map((song, index) => (
                <SongChip
                  key={index}
                  rank={index + 1}
                  id={song.id}
                  title={song.title}
                  artist_name={song.artist_name}
                  cover={song.cover}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  underline: {
    height: 2,
    backgroundColor: "#000000",
    width: "100%",
    opacity: 0.1,
  },
  headerContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  resultsText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#434343",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666666",
  },
  albumsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  songsList: {
    marginRight: 20,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "#666666",
  },
});

export default SearchResults;
