import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import TopAlbums from "@/components/search/TopAlbums";
import TopSongs from "@/components/search/TopSongs";
import TopReviews from "@/components/search/TopReviews";
import axios from "axios";

import { useLocalSearchParams } from "expo-router";
import TopMedia from "@/components/profile/TopMedia";
import SectionSearchResults from "@/components/profile/SectionSearch";

interface SectionResultsProps {
  route: {
    params: {
      review_id: string;
    };
  };
}

const SectionResults: React.FC<SectionResultsProps> = () => {
  const [mediaResults, setMediaResults] = useState<MediaResponse[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<MediaResponse[]>([]);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { type } = useLocalSearchParams<{
    type: string;
  }>();

  // Fetch initial top songs and albums
  useEffect(() => {
    axios
      .get(`${BASE_URL}/media?sort=review&type=${type}`)
      .then((response) => setMediaResults(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchActive(false);
      return;
    }

    setIsLoading(true);
    try {
      const [mediaResponse] = await Promise.all([
        axios.get(`${BASE_URL}/media?name=${query}&type=${type}`),
      ]);

      setSearchResults(mediaResponse.data);
      setIsSearchActive(true);
      console.log("searchResults", searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SearchBar onSearch={handleSearch} />

      {isSearchActive ? (
        <SectionSearchResults media={searchResults} isLoading={isLoading} />
      ) : (
        <View>
          <TopMedia media={mediaResults} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: "#fff",
  },
});

export default SectionResults;
