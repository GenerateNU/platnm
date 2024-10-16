import React from "react";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";

type MediaCardProps = {
  media: Media;
};

function isAlbum(media: Media): media is Album {
  return (media as Album).genre_id !== undefined;
}

function isTrack(media: Media): media is Track {
  return (media as Track).album_id !== undefined;
}

const MediaCard = ({ media }: MediaCardProps) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: media.cover }} style={styles.image} />
      {isTrack(media) ? (
        <>
          <Text style={styles.songNameText}>{media.title}</Text>
          <Text>{media.album_title}</Text>
        </>
      ) : isAlbum(media) ? (
        <Text style={styles.songNameText}>{media.title}</Text>
      ) : null}
    </View>
  );
};

export default MediaCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
    gap: 2,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },
  songNameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
