import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Nudge = () => {
  const image = require("@/assets/images/placeholder-profile.png");

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Nudge song to </Text>
      <View style={styles.imageContainer}>
        {[...Array(5)].map((_, index) => (
          <Image key={index} source={image} style={styles.image} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    height: "60%",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  image: {
    width: 50,
    height: 50,
  },
});

export default Nudge;
