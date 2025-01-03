import React from "react";
import { useState } from "react";

//"Import SongChip from @/components/SongChip" where?
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import Section from "./Section";
import SectionItem from "./SectionItem";

type MediaCardProps = {
  sectionId: string;
  media: SectionItem[];
};

const TopMedia = ({ sectionId, media }: MediaCardProps) => {
  const image =
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";

  return (
    <View>
      <Text style={styles.title}>Add Item</Text>

      <ScrollView
        style={styles.container}
        showsHorizontalScrollIndicator={false}
      >
        {media?.map((m, index) => (
          <SectionItem
            key={index}
            id={sectionId}
            rank={index + 1}
            title={m.title}
            cover={m.cover_photo}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  songName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#434343",
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#434343",
    marginBottom: 4,
  },
});

export default TopMedia;
