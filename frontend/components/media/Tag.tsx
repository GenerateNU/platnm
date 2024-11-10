import { StyleSheet, Text, Button } from "react-native";
import React from "react";

export type TagProps = {
  name: string;
  selected: boolean;
  handleTagSelect: (tag: string) => void;
};

const Tag = ({ name, selected, handleTagSelect }: TagProps) => {
  return (
    <Button style={styles.tag} onPress={() => handleTagSelect(name)}>
      <Text style={styles.tagText}>{name}</Text>
    </Button>
  );
};

export default Tag;

const styles = StyleSheet.create({
  tag: {
    width: "auto",
    height: "auto",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "#A09CAB",
  },
  tagText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
