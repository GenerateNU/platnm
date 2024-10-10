import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const Tags = () => {
  const [tags, setTags] = useState("Tags");

  return (
    <View style={styles.tag}>
      <Text> {tags} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    color: "#434343",
    fontSize: 19,
    padding: 20,
  },
});

export default Tags;
