import React from "react";
import { useState } from "react";

//"Import SongChip from @/components/SongChip" where?
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface SongChipProps {
  song: Track;
}

const SongChip: React.FC<SongChipProps> = ({ song }: SongChipProps) => {
  const image =
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";

  return (
    <View style={styles.chip}>
      <Image
        width={50}
        height={50}
        source={{
          uri: image,
        }}
      />
      <Text style={styles.songName}>{song.title}</Text>
      <Text>Artist Name</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 15,
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

export default SongChip;
