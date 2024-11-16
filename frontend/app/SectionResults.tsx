import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import TopAlbums from "@/components/search/TopAlbums";
import TopSongs from "@/components/search/TopSongs";
import TopReviews from "@/components/search/TopReviews";
import axios from "axios";

interface SectionResultsProps {
    type: string;
  }


const SectionResults: React.FC<SectionResultsProps> = ({
    type,
}) => {
    const [mediaResults, setMediaResults] = useState<MediaResponse[]>([])
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<MediaResponse[]>([])
    const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
    
      // Fetch initial top songs and albums
      useEffect(() => {
        axios
          .get(`${BASE_URL}/media?sort=review&type=${type}`)
          .then((response) => setMediaResults(response.data))
          .catch((error) => console.error(error));;
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
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      };

    return (
        <View>
        <SearchBar />
        <ScrollView>
            <TopAlbums />
            <TopSongs />
            <TopReviews />
        </ScrollView>
        </View>
    );
}

export default SectionResults;