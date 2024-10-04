import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const MediaCard = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/tvgirl.jpeg")}
        style={styles.reactLogo}
      />
      <Text style={styles.songNameText}>Song name</Text>
      <Text>Album name</Text>
    </View>
  );
};

export default MediaCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  reactLogo: {
    width: 200,
    height: 200,
  },
  songNameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
