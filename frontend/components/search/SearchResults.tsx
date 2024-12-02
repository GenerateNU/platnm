import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity} from "react-native";
import SongChip from "@/components/search/SongChip";
import AlbumSearchCard from "@/components/search/AlbumSearchCard";
import ProfileChip from "@/components/search/ProfileChip";
import Filter from "@/components/search/Filter";
import AntDesign from "@expo/vector-icons/AntDesign";
import SongCard from "@/components/SongCard";

interface SearchResultsProps {
  songs: Media[];
  albums: Media[];
  profiles: UserProfile[];
  isLoading: boolean;
  filter: "all" | "songs" | "albums" | "profile";
}

type FilterOption = "all" | "songs" | "albums" | "profile";

const SearchResults: React.FC<SearchResultsProps> = ({
  songs,
  albums,
  profiles,
  isLoading,
}) => {
  if (isLoading) {
    return <Text style={styles.loadingText}>Searching...</Text>;
  }

  if (songs.length === null && albums.length === null && profiles.length === null) {
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
        filterOptions={["all", "songs", "albums", "profile"]}
        onFilterChange={handleFilterChange}
      />
      <View style={styles.resultGrid}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          {(selectedFilter === "all" || selectedFilter === "profile") && (
            <View>
              {selectedFilter === "all" ? (
                <TouchableOpacity onPress={() => setSelectedFilter("profile")}>
                  <Text style={styles.title}>
                    Profiles <AntDesign name="right" size={24} color="black" />
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.title}>Profiles</Text>
              )}
              <View style={styles.profileContainer}>
                {profiles == null || profiles.length === 0  ? (
                  <Text style={styles.noResults}>No profiles found</Text>
                ) : selectedFilter === "all" ? (
                  console.log(profiles[0]),
                  profiles
                    .slice(0, 2)
                    .map((profile, idx) => (
                      <ProfileChip
                        key = {idx}
                        display_name={profile.display_name}
                        profile_picture={profile.profile_picture}
                        id={profile.id}
                      />
                    ))
                ) : (
                  profiles.map((profile, idx) => (
                    <ProfileChip
                      key = {idx}
                      display_name={profile.display_name}
                      profile_picture={profile.profile_picture}
                      id={profile.id}
                    />
                  ))
                )}
              </View>
            </View>
          )}

          {(selectedFilter === "all" || selectedFilter === "songs") && (
            <View>
              {selectedFilter === "all" ? (
                <TouchableOpacity onPress={() => setSelectedFilter("songs")}>
                  <Text style={styles.title}>
                    Songs <AntDesign name="right" size={24} color="black" />
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.title}>Songs</Text>
              )}
              {songs.length === 0 ? ( <Text style={styles.noResults}>No songs found</Text>): selectedFilter === "songs" ? (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                  }}
                >
                  {songs?.map((song, idx) => (
                    <View
                      style={{ width: "48%", marginBottom: 16 }}
                    >
                     <AlbumSearchCard
                        type ={"Song"}
                        key = {idx}
                        id={song.id}
                        artist_name={song.artist_name}
                        album_name={song.title}
                        cover={song.cover}
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 16,
                    }}
                  >
                    <View style={styles.gridContainer}>
                      {songs?.slice(0, 9).map((song, idx) => (
                        <View style={styles.gridItem}>
                          <SongChip
                            key = {idx}
                            id={song.id}
                            title={song.title}
                            artist_name={song.artist_name}
                            cover={song.cover}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              )}            
            </View>
          )}
          {(selectedFilter === "all" || selectedFilter === "albums") && (
            <View>
              {selectedFilter === "all" ? (
                <TouchableOpacity onPress={() => setSelectedFilter("albums")}>
                  <Text style={styles.title}>
                    Albums <AntDesign name="right" size={24} color="black" />
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.title}>Albums</Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                }}
              >
                {songs.length === 0 ? ( <Text style={styles.noResults}>No albums found</Text>): (selectedFilter === "all" ? albums.slice(0, 2) : albums)?.map(
                  (album, idx) => (
                    <View style={styles.albumsList} >
                      <AlbumSearchCard
                        type = {"album"}
                       key = {idx}
                        id={album.id}
                        artist_name={album.artist_name}
                        album_name={album.title}
                        cover={album.cover}
                      />
                    </View>
                  )
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
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
    width: "48%",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  wrapper: {
    width: "100%",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 500,
  },
  gridItem: {
    width: "33.33%",
    marginBottom: 16,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "#666666",
  },
});

export default SearchResults;
