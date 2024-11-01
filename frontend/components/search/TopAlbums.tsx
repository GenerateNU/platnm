import React from "react";
import { useState } from "react";

//"Import SongChip from @/components/SongChip" where?
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import AlbumSearchCard from "@/components/search/AlbumSearchCard"

  const SongChip: React.FC = () => {
    const image =
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";

    return (
        <View style={styles.container}>
            <AlbumSearchCard rank ={1} artist_name ={"adele"} album_name ={"stuff"} cover ={""}/> 
            <AlbumSearchCard rank ={1} artist_name ={"adele"} album_name ={"stuff"} cover ={""}/> 
            <AlbumSearchCard rank ={1} artist_name ={"adele"} album_name ={"stuff"} cover ={""}/> 
        </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
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
      }

  })

  export default SongChip;