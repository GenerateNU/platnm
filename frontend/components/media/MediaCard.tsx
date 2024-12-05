import React from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { Button, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "../AuthProvider";

type MediaCardProps = {
  media: Media;
  full?: boolean;
  showTopBar?: boolean;
  showRateButton?: boolean;
};

function isTrack(media: Media): media is Track {
  return (media as Track).album_id !== undefined;
}

const MediaCard = ({
  media,
  full = false,
  showTopBar = true,
  showRateButton = true,
}: MediaCardProps) => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { userId } = useAuthContext();
  const addToOnQueue = async () => {
    await axios.post(`${BASE_URL}/playlist/on_queue/${userId}`, {
      ...media,
    });
  };

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <ImageBackground
          style={full ? styles.fullBackground : styles.imageBackground}
          source={{ uri: media.cover }}
        >
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.6)",
              `rgba(242, 128, 55, ${full ? 1 : 0.6})`,
            ]}
            style={full ? styles.fullBackground : styles.background}
          >
            <View style={styles.contentContainer}>
              <View>
                {showTopBar && (
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
                      {media?.media_type === "track" && (
                        <IconButton
                          icon="bookmark-outline"
                          iconColor="white"
                          size={24}
                          onPress={() => addToOnQueue()}
                        />
                      )}
                    </View>
                  </View>
                )}
                <View style={styles.artist}>
                  <Image
                    style={styles.image}
                    source={{ uri: media.artist_photo }}
                  />
                  <Text style={styles.artistText}>{media.artist_name}</Text>
                </View>
                <Text style={styles.primaryMediaText}>{media.title}</Text>
                {isTrack(media) && (
                  <Text style={styles.albumText}>{media.album_title}</Text>
                )}
              </View>
              {full && (
                <View style={styles.noReviewsContainer}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    You've got taste!
                  </Text>
                  <Text style={styles.emptyText}>
                    We dont have any reviews for this {media.media_type} yet.
                  </Text>
                  <Text style={styles.emptyText}>
                    Be the first to leave a rating
                  </Text>
                </View>
              )}
              {showRateButton && (
                <View style={styles.addReviewContainer}>
                  <Button
                    onPress={() =>
                      router.push({
                        pathname: "/CreateRating",
                        params: {
                          mediaType: isTrack(media) ? "track" : "album",
                          mediaId: media.id,
                        },
                      })
                    }
                    icon={"plus"}
                    textColor="white"
                  >
                    Rate
                  </Button>
                </View>
              )}
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MediaCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noReviewsContainer: {
    flex: 1,
    margin: "auto",
    marginTop: 128,
    width: "100%",
  },
  emptyText: {
    fontSize: 18,
    color: "white",
    marginTop: 12,
    width: "80%",
  },
  imageBackground: {
    width: "100%",
  },
  fullBackground: {
    width: "100%",
    height: Dimensions.get("window").height,
    opacity: 0.9,
    backgroundColor: "black",
    paddingBottom: 72,
  },
  background: {
    height: 350,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 28,
    marginBottom: 12,
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
  addReviewContainer: {
    backgroundColor: "#000000",
    borderRadius: 8,
    padding: 8,
    opacity: 1,
    marginBottom: 16,
  },
});
