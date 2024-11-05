<<<<<<< HEAD
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import TopAlbums from "@/components/search/TopAlbums";
import SongChip from "@/components/search/SongChip";
=======
import { StyleSheet, View } from "react-native";
import TopAlbums from "@/components/search/TopAlbums"
import axios from "axios";
import { useEffect, useState } from "react";
const track: Track = {
  media: "Track",
  id: 2,
  album_id: 2,
  album_title: "Album Title",
  title: "Song title",
  duration: 1, // duration in seconds
  release_date: new Date(),
  cover:     "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png",
  media_type: "track"
}

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
    <TopAlbums albums={media}/>
    {/* <SongChip song={track}/> */}
    </View>;
}
>>>>>>> 61e62f162304149e361464df1e7947b01e13d41f



export default function SearchScreen() {
  return (
    <View>
      <TopAlbums />
      <SongChip />
    </View>
  );
}