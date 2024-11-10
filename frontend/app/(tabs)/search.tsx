import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import TopAlbums from "@/components/search/TopAlbums";
import TopSongs from "@/components/search/TopSongs";
import axios from "axios";

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<{
    songs: MediaResponse[];
    albums: MediaResponse[];
  }>({
    songs: [],
    albums: [],
  });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialSongs, setInitialSongs] = useState<MediaResponse[]>([]);
  const [initialAlbums, setInitialAlbums] = useState<MediaResponse[]>([]);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  // Fetch initial top songs and albums
  useEffect(() => {
    axios
      .get(`${BASE_URL}/media?sort=review&type=album`)
      .then((response) => setInitialAlbums(response.data))
      .catch((error) => console.error(error));

    axios
      .get(`${BASE_URL}/media?sort=review&type=track`)
      .then((response) => setInitialSongs(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ songs: [], albums: [] });
      setIsSearchActive(false);
      return;
    }

    setIsLoading(true);
    try {
      const [songsResponse, albumsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/media?name=${query}&type=track`),
        axios.get(`${BASE_URL}/media?name=${query}&type=album`)
      ]);

      setSearchResults({
        songs: songsResponse.data,
        albums: albumsResponse.data
      });
      setIsSearchActive(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ songs: [], albums: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      
      {isSearchActive ? (
        <SearchResults 
          songs={searchResults.songs}
          albums={searchResults.albums}
          isLoading={isLoading}
        />
      ) : (
        <View>
          <TopSongs songs={initialSongs} />
          <TopAlbums albums={initialAlbums} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
});

export default SearchPage;