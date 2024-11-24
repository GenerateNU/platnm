import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import SongChip from "@/components/search/SongChip";
import AlbumSearchCard from "@/components/search/AlbumSearchCard";
import ProfileChip from "@/components/search/ProfileChip";
import Filter from "@/components/search/Filter";

interface SearchResultsProps {
  songs: MediaResponse[];
  albums: MediaResponse[];
  profiles: UserProfile[];
  isLoading: boolean;
  filter: "all" | "songs" | "albums" | "profile";
}

const SearchResults: React.FC<SearchResultsProps> = ({
  songs,
  albums,
  profiles,
  isLoading,
}) => {
  if (isLoading) {
    return <Text style={styles.loadingText}>Searching...</Text>;
  }

  if (songs.length === 0 && albums.length === 0 && profiles.length == 0) {
    return <Text style={styles.noResults}>No results found</Text>;
  }

  const filterOptions = ["all", "songs", "albums", "profile"];

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");

  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilter(filter);
  };

  return (
    <View style={styles.container}>
      <Filter
        currentFilter={selectedFilter}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
      <View style={styles.resultGrid}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          {(selectedFilter === "all" || selectedFilter === "profile") && (
            <View style={styles.songsList}>
              <Text style={styles.title}>Profiles</Text>
              {profiles?.map((profile, idx) => (
                <ProfileChip
                  display_name={profile.display_name}
                  profile_picture={profile.profile_picture}
                  id={profile.id}
                  key={idx}
                />
              ))}
            </View>
          )}

          {(selectedFilter === "all" || selectedFilter === "songs") && (
            <View style={styles.songsList}>
              <Text style={styles.title}>Songs</Text>
              <ScrollView>
                {songs?.map((song, index) => (
                  <SongChip
                    key={index}
                    rank={index + 1}
                    id={song.media.id}
                    title={song.media.title}
                    artist_name={song.media.artist_name}
                    cover={song.media.cover}
                  />
                ))}
              </ScrollView>
            </View>
          )}
          {(selectedFilter === "all" || selectedFilter === "albums") && (
            <View>
              <Text style={styles.title}>Albums</Text>
              <View style={styles.albumsList}>
                {albums?.map((album, index) => (
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
            </View>
          )}
        </ScrollView>
      </View>
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
  albumsList: {
    width: "48%", // Slightly less than 50% to allow for spacing
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "#666666",
  },
});

export default SearchResults;
