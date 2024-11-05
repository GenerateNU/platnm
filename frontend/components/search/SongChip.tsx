import React from "react";
import { useState } from "react";

//"Import SongChip from @/components/SongChip" where?
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface SongChipProps {
    song: Track;
  }


  type Track = {
    media: string;
    id: number;
    album_id: number;
    album_title: string;
    title: string;
    duration: number;
    release_date: Date;
    cover: string;
    media_type: string;
  };
  
  const track: Track[] = [{
    media: "Track",
    id: 2,
    album_id: 2,  
    album_title: "first album Title",
    title: "Song title 1",
    duration: 1,
    release_date: new Date(),
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png",
    media_type: "track"
  },
  {
    media: "Track",
    id: 2,
    album_id: 2,  
    album_title: "2nd album title",
    title: "Song title 2",
    duration: 1,
    release_date: new Date(),
    cover: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png",
    media_type: "track"
  }];
  const SongChip: React.FC = () => {
    const image =
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";

    return (

        <View style={styles.songsContainer}>
        {track.map((song, index) => (
          <TouchableOpacity key={`${song.id}-${index}`} style={styles.songCard}>
            <Image
              source={{ uri: song.cover }}
              style={styles.coverImage}
            />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle} numberOfLines={1}>
                {song.title}
              </Text>
              <Text style={styles.albumTitle} numberOfLines={1}>
                {song.album_title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
      container: {
        paddingTop: 80,
        paddingLeft: 30,
        backgroundColor: "#FFFF",
        flex: 1,
      },
      songsContainer: {
        marginTop: 20,
        paddingRight: 30,
      },
      songCard: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        padding: 8,
        borderRadius: 8,
      },
      coverImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
      },
      songInfo: {
        marginLeft: 12,
        flex: 1,
      },
      songTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
      },
      albumTitle: {
        fontSize: 14,
        color: "#666",
      },
      headerImage: {
        color: "#808080",
        bottom: -90,
        left: -35,
        position: "absolute",
      },
      titleContainer: {
        flexDirection: "row",
        gap: 8,
      },
  })

  export default SongChip;