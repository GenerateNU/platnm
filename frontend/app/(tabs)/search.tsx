import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import TopAlbums from "@/components/search/TopAlbums";
import SongChip from "@/components/search/SongChip";



export default function SearchScreen() {
  return (
    <View>
      <TopAlbums />
      <SongChip />
    </View>
  );
}