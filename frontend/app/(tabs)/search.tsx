import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import TopAlbums from "@/components/search/TopAlbums";
import TopSongs from "@/components/TopSongs";
import axios from "axios";
import { useEffect, useState } from "react";


export default function SearchScreen() {

  const [media, setMedia] = useState<MediaResponse[]>([]);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  
  useEffect(() => {
    axios
      .get(`${BASE_URL}/media?sort=review`)
      .then((response) => setMedia(response.data))
      .catch((error) => console.error(error));
  }, []);

  return <View style={styles.container}>
    <TopSongs songs={media}/>
    <TopAlbums albums={media}/>
    </View>;
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
