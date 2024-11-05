import { StyleSheet, View } from "react-native";
import TopAlbums from "@/components/search/TopAlbums"
import SongChip from "@/components/search/SongChip"

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
  return <View style={styles.container}>
    <TopAlbums/>
    <SongChip song={track}/>
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
