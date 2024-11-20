import React from "react";
import { router } from "expo-router";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { Button } from "react-native-paper";

type MediaCardProps = {
  media: Media;
};

function isTrack(media: Media): media is Track {
  return (media as Track).album_id !== undefined;
}

const MediaCard = ({ media }: MediaCardProps) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={{ uri: media.cover }}
      >
        <View style={styles.contentContainer}>
          <View>
            <View style={styles.artist}>
              <Image style={styles.image} source={{ uri: media.cover }} />
              <Text>{media.artist_name}</Text>
            </View>
            <Text style={styles.songNameText}>{media.title}</Text>
            {isTrack(media) && <Text>{media.album_title}</Text>}
          </View>
          <View style={styles.addReviewContainer}>
            <Button
              onPress={() =>
                router.push({
                  pathname: "/CreateReview",
                  params: {
                    mediaName: media.title,
                    mediaType: media.media_type,
                    mediaId: media.id,
                    cover: media.cover,
                    artistName: media.artist_name,
                  },
                })
              }
              icon={"plus"}
              textColor="white"
            >
              Rate
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default MediaCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    width: "100%",
    height: 400,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  artist: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 8,
    opacity: 0.6,
    borderRadius: 25,
  },
  songNameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addReviewContainer: {
    backgroundColor: "#000000",
    borderRadius: 8,
    padding: 8,
  },
});
