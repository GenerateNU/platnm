import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Tag from "./Tag";

const TAGS = [
  "Experimental",
  "Head Scratcher",
  "Magnum Opus",
  "Introspective",
  "Heartfelt",
  "Hype",
  "Underrated",
  "Overrated",
  "Not Good",
  "Tough Listen",
  "Features Carried",
];

export type TagSelectorProps = {
  tags: string[];
  handleTagSelect: (tag: string) => void;
};

const TagSelector = ({ handleTagSelect, tags }: TagSelectorProps) => {
  return (
    <View>
      <Text style={styles.text}>Tags</Text>
      <View style={styles.tags}>
        {TAGS.map((tag) => (
          <Tag
            name={tag}
            selected={tags.includes(tag)}
            handleTagSelect={handleTagSelect}
          />
        ))}
      </View>
    </View>
  );
};

export default TagSelector;

const styles = StyleSheet.create({
  text: {
    marginVertical: 10,
    fontSize: 16,
  },
  tags: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});