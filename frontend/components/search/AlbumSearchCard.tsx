import React from "react";
import { useState } from "react";

import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface AlbumSearchCardProps {
    rank: number,
    artist_name: string,
    album_name: string,
    cover: string
  }

  const AlbumSearchCard: React.FC<AlbumSearchCardProps> = ({ rank, artist_name, album_name, cover }: AlbumSearchCardProps) => {
    const image =
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";

    return (
        <View style={styles.chip}>
            <View style={styles.albumContainer}>

            <Image
              source={require("@/assets/images/Profile/record.png")}
              style={styles.recordImage}
            />
            <Image 
            width = {110}
            height = {110}
            source = {{
                uri: image}}/>
            </View>
            <Text style ={styles.rank}>
                {rank}
            </Text>
            <Text style ={styles.albumName}>
                {album_name}
            </Text>
            <Text>
                {artist_name}
            </Text>
        </View>
    );
  };

  const styles = StyleSheet.create({
    chip: {
        borderRadius: 15,

    },
    rank: {
        color: "#000",
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 20, /* 142.857% */
    },
    albumContainer: {
        width: 50, // Adjust size to match your record image
        height: 50, // Adjust size to match your record image
        alignItems: "center",
        justifyContent: "center",
      },
    albumName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#434343",
        marginBottom: 4,
      },
      recordImage: {
        width: 110,
        height: 110,
        position: "absolute",
        right: -70,
        top: -30,
      },
      artistName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#434343",
        marginBottom: 4,
      }

  })

  export default AlbumSearchCard;