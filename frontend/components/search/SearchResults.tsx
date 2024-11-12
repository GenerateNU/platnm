import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import SongChip from "@/components/search/SongChip";
import AlbumSearchCard from "@/components/search/AlbumSearchCard";
import Filter from "@/components/search/Filter";

interface SearchResultsProps {
  songs: MediaResponse[];
  albums: MediaResponse[];
  isLoading: boolean;
}

type FilterOption = "all" | "songs" | "albums" | "profile";

const SearchResults: React.FC<SearchResultsProps> = ({
  songs,
  albums,
  isLoading,
}) => {
  if (isLoading) {
    return <Text style={styles.loadingText}>Searching...</Text>;
  }

  if (songs.length === 0 && albums.length === 0) {
    return <Text style={styles.noResults}>No results found</Text>;
  }

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");

  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilter(filter);
  };

  return (
    <View style={styles.container}>
      <Filter
        currentFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />
      <View style={styles.resultGrid}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          {(selectedFilter === "all" || selectedFilter === "albums") && (
            <View>
              {albums.map((album, index) => (
                <AlbumSearchCard
                  id={album.media.id}
                  key={album.media.id}
                  rank={index + 1}
                  artist_name={album.media.artist_name}
                  album_name={album.media.title}
                  cover={album.media.cover}
                />
              ))}
            </View>
          )}
          {(selectedFilter === "all" || selectedFilter === "songs") && (
            <View style={styles.songsList}>
              {songs.map((song, index) => (
                <SongChip
                  key={index}
                  rank={index + 1}
                  id={song.media.id}
                  title={song.media.title}
                  artist_name={song.media.artist_name}
                  cover={song.media.cover}
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
  headerContainer: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#000000",
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
  resultGrid: {
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
