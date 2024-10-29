import React from "react";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";

type trackCollapsedProps = {
  track: Track;
};

const MediaCard = ({ track }: trackCollapsedProps) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: track.cover }} style={styles.image} />
        <>
          <Text style={styles.songNameText}>{track.title}</Text>
          {/* <Text>{album.}</Text> */}
        </>
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
    width: 110,
    height: 110,
    // marginBottom: 8,
  },
  songNameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
