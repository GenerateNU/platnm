import { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface SongCardProps {
  mediaName: string;
}

const SongCard: React.FC<SongCardProps> = ({ mediaName }: SongCardProps) => {
  // const image = require("@/assets/images/placeholder-image.png");
  const image =
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";
  const [releaseDate, setReleaseDate] = useState(new Date());
  const [artistName, setArtistName] = useState("Artist Name");

  return (
    <View style={styles.card}>
      <Image
        width={150}
        height={150}
        source={{
          uri: image,
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.releaseDate}>
          {releaseDate.toLocaleDateString()}
        </Text>
        <Text style={styles.songName}>{mediaName}</Text>
        <Text style={styles.artistName}>{artistName} • Song</Text>
      </View>
      <TouchableOpacity style={styles.seeAlbumButton}>
        <Text style={styles.seeAlbum}>See album</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#A9A9A9",
    padding: 10,
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  releaseDate: {
    color: "#434343",
    marginBottom: 4,
  },
  songName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#434343",
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    color: "#434343",
    marginBottom: 8,
  },
  seeAlbumButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  seeAlbum: {
    color: "#B7B6B6",
    textDecorationLine: "underline",
  },
});

export default SongCard;
