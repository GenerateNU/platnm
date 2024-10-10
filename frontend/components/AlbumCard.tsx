import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const AlbumCard = () => {

    const ablumImage = require('@/assets/images/placeholder-image.png');
    const songImage = require('@/assets/images/song-placeholder.png');
    const [releaseDate, setReleaseDate] = useState(new Date());
    const [albumName, setSongName] = useState("Name of Album");
    const [artistName, setArtistName] = useState("Artist Name");


  return (
    <View style={styles.card}>
      <Image source={ablumImage} />
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.releaseDate}>{releaseDate.toLocaleDateString()}</Text>
          <Text style={styles.albumName}>{albumName}</Text>
          <Text style={styles.artistName}>{artistName} • Album</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.artistName}>Featured Songs:</Text>
          <TouchableOpacity style={styles.featuredSongs}>
            <Image source={songImage} style={styles.songImage} />
            <Image source={songImage} style={styles.songImage} />
            <Image source={songImage} style={styles.songImage} />
            <Image source={songImage} style={styles.songImage} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#A9A9A9',
    padding: 10,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  releaseDate: {
    color: '#434343',
    marginBottom: 4,
  },
  albumName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#434343',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    color: '#434343',
    marginBottom: 4,
  },
  featuredSongs: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  songImage: {
    width: 30, 
    height: 30,
  },
});

export default AlbumCard;