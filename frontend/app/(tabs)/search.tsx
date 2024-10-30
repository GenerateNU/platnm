import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SongChip from "@/components/SongChip";
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
  return <SongChip song={track}/>;
}

const styles = StyleSheet.create({
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
