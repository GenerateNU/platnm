import { StyleSheet, View, Text, Image } from "react-native";

export default function ArtistBubble({
  artist,
}: {
  artist: { name: string; profilePictureUrl: string; selected: boolean };
}) {

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: artist.profilePictureUrl }}
        style={[
          styles.profilePicture,
          artist.selected && styles.selected,
        ]}
      />
      <Text style={styles.name}>{artist.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 12,
  },
  profilePicture: {
    borderRadius: 36,
    width: 72,
    height: 72,
  },
  selected: {
    borderColor: "black",
    borderWidth: 4,
  },
  name: {
    textAlign: "center",
    fontSize: 16,
  },
});
