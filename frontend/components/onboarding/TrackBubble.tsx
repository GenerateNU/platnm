import { StyleSheet, View, Text, Image } from "react-native";
import Vinyl from "@/assets/images/vinyl.svg";

export default function TrackBubble({
  track,
}: {
  track: { name: string; artist: string; imageUrl: string; selected: boolean };
}) {
  return (
    <View style={styles.container}>
      <View style={styles.imagesContainer}>
        <Image
          source={{ uri: track.imageUrl }}
          style={[styles.profilePicture, track.selected && styles.selected]}
        />
        <Vinyl style={styles.vinyl} />
      </View>
      <View style={styles.details}>
        <Text>{track.name}</Text>
        <Text>{track.artist}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
  profilePicture: {
    borderRadius: 10,
    width: 100,
    height: 100,
  },
  selected: {
    borderColor: "black",
    borderWidth: 4,
  },
  details: {
    flexDirection: "column",
  },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  vinyl: {
    marginLeft: -50,
    zIndex: -1,
  },
});
