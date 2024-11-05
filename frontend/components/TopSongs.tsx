import { useState, useCallback } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import axios from "axios";
import { useFocusEffect } from "expo-router";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface SpotifyTrack {
  id: string;
  name: string;
  artists: {
    name: string;
  }[];
  album: {
    name: string;
    images: {
      url: string;
    }[];
  };
}

interface TopItemsResponse {
  topTracks: SpotifyTrack[];
  topArtists: any[];
}

export default function SearchScreen() {
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);

  useFocusEffect(
    useCallback(() => {
      axios
        .get<TopItemsResponse>(`${BASE_URL}/top-items`)
        .then((response) => {
          console.log(response.data.topTracks);
          setTopTracks(response.data.topTracks);
        })
        .catch((error) => console.error(error));
    }, []) // Empty dependency array since we just want to fetch on focus
  );

  return (
    <ScrollView>
      <Text style={styles.title}>Your Top Tracks</Text>
      {topTracks.map((track) => (
        <View key={track.id} style={styles.trackContainer}>
          <Text style={styles.trackName}>{track.name}</Text>
          <Text style={styles.artistName}>
            {track.artists.map(artist => artist.name).join(', ')}
          </Text>
          <Text style={styles.albumName}>{track.album.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  trackContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  trackName: {
    fontSize: 18,
    fontWeight: '600',
  },
  artistName: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  albumName: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
});