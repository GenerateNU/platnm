import { StyleSheet, View, Text, Image } from "react-native";

export default function ArtistBubble({
  artist,
}: {
  artist: { name: string; profilePictureUrl: string; selected: boolean };
}) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "@/assets/images/gray-circle.svg" }}
        style={[
          styles.profilePicture,
          artist.selected && styles.profilePictureSelected,
        ]}
      />
      <Text style={styles.name}>{artist.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
  },
  profilePicture: {
    borderColor: "black",
  },
  profilePictureSelected: {
    borderColor: "blue",
    borderWidth: 2,
  },
  name: {
    textAlign: "center",
    fontSize: 16,
  },
});
