import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import SongChip from "@/components/search/SongChip";
import SearchCard from "@/components/search/AlbumSearchCard";
import ProfileChip from "@/components/search/ProfileChip";
import Filter from "@/components/search/Filter";
import AntDesign from "@expo/vector-icons/AntDesign";

interface SearchResultsProps {
  songs: Media[];
  albums: Media[];
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

  if (songs?.length === 0 && albums?.length === 0 && profiles?.length == 0) {
    return <Text style={styles.noResults}>No results found</Text>;
  }

  const filterOptions: FilterOption[] = ["all", "songs", "albums", "profile"];
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
            <View>
              {selectedFilter === "all" ? (
                <TouchableOpacity onPress={() => setSelectedFilter("profile")}>
                  <Text style={styles.title}>
                    Profiles <AntDesign name="right" size={18} color="black" />
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.title}>Profiles</Text>
              )}
              <View style={styles.profileContainer}>
                {profiles == null || profiles.length === 0 ? (
                  <Text style={styles.noResults}>No profiles found</Text>
                ) : selectedFilter === "all" ? (
                  (console.log(profiles[0]),
                  profiles
                    .slice(0, 2)
                    .map((profile, idx) => (
                      <ProfileChip
                        key={idx}
                        display_name={profile.display_name}
                        profile_picture={profile.profile_picture}
                        id={profile.user_id}
                      />
                    )))
                ) : (
                  profiles.map((profile, idx) => (
                    <ProfileChip
                      key={idx}
                      display_name={profile.display_name}
                      profile_picture={profile.profile_picture}
                      id={profile.user_id}
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
                    Songs <AntDesign name="right" size={18} color="black" />
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.title}>Songs</Text>
              )}
              {songs.length === 0 ? (
                <Text style={styles.noResults}>No songs found</Text>
              ) : selectedFilter === "songs" ? (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {songs?.map((song, idx) => (
                    <View style={{ width: "48%", marginBottom: 16 }}>
                      <SearchCard
                        rank={idx + 1}
                        type={song.media_type}
                        key={idx}
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
                    }}
                  >
                    <View style={styles.gridContainer}>
                      {songs?.slice(0, 9).map((song, idx) => (
                        <View style={styles.gridItem}>
                          <SongChip
                            rank={idx + 1}
                            key={idx}
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
                    Albums <AntDesign name="right" size={18} color="black" />
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
                }}
              >
                {albums.length === 0 ? (
                  <Text style={styles.noResults}>No albums found</Text>
                ) : (
                  (selectedFilter === "all" ? albums.slice(0, 2) : albums)?.map(
                    (album, idx) => (
                      <View style={styles.albumsList}>
                        <SearchCard
                          rank={idx + 1}
                          type={"album"}
                          key={idx}
                          id={album.id}
                          artist_name={album.artist_name}
                          album_name={album.title}
                          cover={album.cover}
                        />
                      </View>
                    ),
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
    paddingVertical: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
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
    width: "100%",
  },
  albumsList: {
    width: "50%",
    marginBottom: 16,
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
    marginTop: 6,
    color: "#666666",
  },
});

export default SearchResults;
