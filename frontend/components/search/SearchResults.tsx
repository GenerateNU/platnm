import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity} from "react-native";
import SongChip from "@/components/search/SongChip";
import AlbumSearchCard from "@/components/search/AlbumSearchCard";
import ProfileChip from "@/components/search/ProfileChip";
import Filter from "@/components/search/Filter";
import AntDesign from "@expo/vector-icons/AntDesign";
import SongCard from "@/components/SongCard";

interface SearchResultsProps {
  songs: MediaResponse[];
  albums: MediaResponse[];
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
                {profiles === null ? (
                  <Text style={styles.noResults}>No profiles found</Text>
                ) : selectedFilter === "all" ? (
                  profiles
                    .slice(0, 2)
                    .map((profile) => (
                      <ProfileChip
                        display_name={profile.display_name}
                        profile_picture={profile.profile_picture}
                        id={profile.id}
                        key={profile.id}
                      />
                    ))
                ) : (
                  profiles.map((profile) => (
                    <ProfileChip
                      display_name={profile.display_name}
                      profile_picture={profile.profile_picture}
                      id={profile.id}
                      key={profile.id}
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
              {selectedFilter === "songs" ? (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                  }}
                >
                  {songs?.map((song) => (
                    <View
                      style={{ width: "48%", marginBottom: 16 }}
                      key={song.media.id}
                    >
                      <SongCard
                        mediaName={song.media.title}
                        mediaType="Song"
                        artistName={song.media.artist_name}
                        cover={song.media.cover}
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
                      {songs?.slice(0, 9).map((song, id) => (
                        <View style={styles.gridItem} key={song.media.id}>
                          <SongChip
                            id={song.media.id}
                            title={song.media.title}
                            artist_name={song.media.artist_name}
                            cover={song.media.cover}
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
                {(selectedFilter === "all" ? albums?.slice(0, 2) : albums)?.map(
                  (album) => (
                    <View style={styles.albumsList} key={album.media.id}>
                      <AlbumSearchCard
                        id={album.media.id}
                        artist_name={album.media.artist_name}
                        album_name={album.media.title}
                        cover={album.media.cover}
                      />
                    </View>
                  )
                )}
              </View>
            </View>
          )}

          {(selectedFilter === "all" || selectedFilter === "songs") && (
            <View style={styles.albumsList}>
              <Text style={styles.title}>Albums</Text>

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
