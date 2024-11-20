import React from "react";
import { router } from "expo-router";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { Button, IconButton } from "react-native-paper";

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
            <View style={styles.iconContainer}>
              <IconButton
                icon="arrow-left"
                iconColor="white"
                size={24}
                onPress={() => router.back()}
              />
              <View style={styles.iconContainer}>
                <IconButton
                  icon="export-variant"
                  iconColor="white"
                  size={24}
                  onPress={() => console.log("More options pressed")}
                />
                <IconButton
                  icon="bookmark-outline"
                  iconColor="white"
                  size={24}
                  onPress={() => console.log("More options pressed")}
                />
              </View>
            </View>
            <View style={styles.artist}>
              <Image style={styles.image} source={{ uri: media.cover }} />
              <Text style={styles.artistText}>{media.artist_name}</Text>
            </View>
            <Text style={styles.primaryMediaText}>{media.title}</Text>
            {isTrack(media) && (
              <Text style={styles.albumText}>{media.album_title}</Text>
            )}
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
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  artist: {
    flexDirection: "row",
    alignItems: "center",
  },
  artistText: {
    color: "white",
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
  addReviewContainer: {
    backgroundColor: "#000000",
    borderRadius: 8,
    padding: 8,
  },
});
