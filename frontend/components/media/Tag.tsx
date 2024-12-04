import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

export type TagProps = {
  name: string;
  selected: boolean;
  handleTagSelect: (tag: string) => void;
};

const Tag = ({ name, selected, handleTagSelect }: TagProps) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.tag,
        backgroundColor: selected ? "#F28037" : "#ECECEC",
      }}
      onPress={() => handleTagSelect(name)}
    >
      <Text style={styles.tagText}>{name}</Text>
    </TouchableOpacity>
  );
};

export default Tag;

const styles = StyleSheet.create({
  tag: {
    width: "auto",
    height: "auto",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 27,
  },
  tagText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
