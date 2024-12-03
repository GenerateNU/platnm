import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface GenreBoxProps {
  genre: string;
  image?: string;
}

const GenreBox: React.FC<GenreBoxProps> = ({ genre, image }) => {
  return (
    <View style={styles.genreBox}>
      {/* {image && <Image source={{ uri: image }} style={styles.genreImage} />} */}
      <Text style={styles.genreText}>{genre}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  genreBox: {
    width: 167,
    height: 98,
    // gap: 0,
    backgroundColor: "orange",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 5,
    margin: 3,
  },
  //   genreImage: {
  //     width: "100%",
  //     height: "100%",
  //     position: "absolute",
  //     opacity: 0, // Hide the image as per the requirement
  //   },
  genreText: {
    fontFamily: "Neue Haas Unica W1G",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24.1,
    textAlign: "left",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "transparent",
    color: "white",
  },
});

export default GenreBox;
