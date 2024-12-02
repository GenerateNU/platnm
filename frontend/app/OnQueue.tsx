import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import axios from "axios";
import { useAuthContext } from "@/components/AuthProvider";

const OnQueue = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { userId } = useAuthContext();

  const [songs, setSongs] = useState([
    {
      id: "1",
      title: "Song Name",
      name: "Artist Name",
      cover: "https://i.scdn.co/image/ab67616d00001e02a56f5696231c1ad328fc9445",
    },
    {
      id: "2",
      title: "Song Name",
      name: "Artist Name",
      cover: "https://i.scdn.co/image/ab67616d00001e02a56f5696231c1ad328fc9445",
    },
    {
      id: "3",
      title: "Song Name",
      name: "Artist Name",
      cover: "https://i.scdn.co/image/ab67616d00001e02a56f5696231c1ad328fc9445",
    },
    {
      id: "4",
      title: "Song Name",
      name: "Artist Name",
      cover: "https://i.scdn.co/image/ab67616d00001e02a56f5696231c1ad328fc9445",
    },
    {
      id: "5",
      title: "Song Name",
      name: "Artist Name",
      cover: "https://i.scdn.co/image/ab67616d00001e02a56f5696231c1ad328fc9445",
    },
  ]);

  const goToSongPage = (id: string) => {
    router.push({
      pathname: "/MediaPage",
      params: {
        mediaType: "track",
        mediaId: id,
      },
    });
  };

  const renderSongItem = ({
    item,
  }: {
    item: { id: string; title: string; name: string; cover: string };
  }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => goToSongPage(item.id)}
    >
      <Image source={{ uri: item.cover }} style={styles.albumCover} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    axios
      .get(`${BASE_URL}/playlist/on_queue/${userId}`)
      .then((response) => {
        setSongs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backContainer}
        >
          <Icon name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>On Queue</Text>
        </View>
      </SafeAreaView>

      {/* Songs Section */}
      <Text style={styles.sectionTitle}>Songs</Text>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backContainer: {
    paddingRight: 15,
    color: "#B7B6B6",
    fontSize: 16,
    marginLeft: 20,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center", // Center horizontally
    left: -30,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  thumbnail: {
    width: 50,
    height: 50,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  albumCover: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginRight: 16,
  },
});

export default OnQueue;
