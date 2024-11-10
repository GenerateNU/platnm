import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import TopAlbums from "@/components/search/TopAlbums";
import TopSongs from "@/components/search/TopSongs";
import SearchBar from "@/components/search/SearchBar"
import axios from "axios";
import { useEffect, useState } from "react";

export default function SearchScreen() {
  const [songs, setSongs] = useState<MediaResponse[]>([]);
  const [albums, setAlbums] = useState<MediaResponse[]>([]);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/media?sort=review&type=album`)
      .then((response) => setAlbums(response.data))
      .catch((error) => console.error(error));

    axios
      .get(`${BASE_URL}/media?sort=review&type=track`)
      .then((response) => setSongs(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <SearchBar/>
      <TopSongs songs={songs} />
      <TopAlbums albums={albums} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingLeft: 30,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
