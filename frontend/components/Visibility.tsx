import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Visibility = () => {
  const [text, setText] = useState("Everyone can view this post");

  const handleClick = () => {
    setText((prevText) =>
      prevText === "Everyone can view this post"
        ? "Followers Only"
        : "Everyone can view this post",
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleClick}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 16,
    color: "#434343",
  },
});

export default Visibility;
