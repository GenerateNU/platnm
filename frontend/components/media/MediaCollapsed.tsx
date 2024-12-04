import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, Image, StyleSheet, ImageBackground } from "react-native";

type trackCollapsedProps = {
  media: Media;
};

function isTrack(media: Media): media is Track {
  return (media as Track).album_id !== undefined;
}

const MediaCollapsed = ({ media }: trackCollapsedProps) => {
  return (
    <ImageBackground
      style={styles.imageBackground}
      source={{ uri: media.cover }}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "rgba(242, 128, 55, 0.6)"]}
        style={styles.background}
      >
        <View style={styles.contentContainer}>
          <View style={styles.artist}>
            <Image style={styles.image} source={{ uri: media.artist_photo }} />
            <Text style={styles.artistText}>{media.artist_name}</Text>
          </View>
          <Text style={styles.primaryMediaText}>{media.title}</Text>
          {isTrack(media) && (
            <Text style={styles.albumText}>{media.album_title}</Text>
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default MediaCollapsed;

const styles = StyleSheet.create({
  imageBackground: {
    width: "100%",
  },
  background: {
    height: 150,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 28,
    marginBottom: 12,
  },
  artist: {
    flexDirection: "row",
    alignItems: "center",
  },
  artistText: {
    color: "white",
    marginLeft: 5,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 8,
    opacity: 0.6,
    borderRadius: 25,
  },
  primaryMediaText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  albumText: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
