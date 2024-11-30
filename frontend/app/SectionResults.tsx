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
  const [mediaResults, setMediaResults] = useState<SectionItem[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SectionItem[]>([]);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { type, sectionId } = useLocalSearchParams<{
    type: string;
    sectionId: string;
  }>();

  // Fetch initial top songs and albums
  useEffect(() => {
    if (type === 'artist') {
      axios
        .get(`${BASE_URL}/media/artist/ `)
        .then((response) => {
          const artists: SectionItem[] = response.data.map((item: Artist) => ({
            id: item.id,
            title: item.name,
            cover_photo: item.photo,
            media_type: "artist",
          }));
          setMediaResults(artists);
        })
        .catch((error) => console.error(error));
    } else {
    axios
      .get(`${BASE_URL}/media?sort=review&type=${type}`)
      .then((response) => {
        const medias: SectionItem[] = response.data.map((item: MediaResponse) => ({
          id: item.media.id,
          title: item.media.title,
          cover_photo: item.media.cover,
          media_type: item.media.media_type
        }));
        setMediaResults(medias);
      })
      .catch((error) => console.error(error));
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchActive(false);
      return;
    }

    setIsLoading(true);
    try {
      if (type === 'artist') {
        const [mediaResponse] = await Promise.all([
          axios.get(`${BASE_URL}/media/artist/${query}`),
        ]);
        const artists: SectionItem[] = mediaResponse.data.map((item: Artist) => ({
          id: item.id,
          title: item.name,
          cover_photo: item.photo,
          media_type: "artist",
        }));
        setSearchResults(artists);

      }
      else {
        const [mediaResponse] = await Promise.all([
          axios.get(`${BASE_URL}/media/${query}`),
        ]);
        const medias: SectionItem[] = mediaResponse.data.map((item: Media) => ({
          id: item.id,
          title: item.title,
          cover_photo: item.cover,
          media_type: item.media_type,
        }));
        setSearchResults(medias);
        console.log("mediaResponse", mediaResponse.data);
      }
      setIsSearchActive(true);
      console.log("searchResults", searchResults);
      console.log("mediaResults", mediaResults);
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
        <SectionSearchResults sectionId={sectionId} media={searchResults} isLoading={isLoading} />
      ) : (
        <View>
          <TopMedia sectionId={sectionId} media={mediaResults} />
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
