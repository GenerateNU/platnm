import { Image, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import axios from "axios";
import ReviewPreview from "@/components/ReviewPreview";

export default function HomeScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    const fetchPreviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/feed`);
        setPreviews(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
    <View>
        {previews.map((preview) => (
          <ReviewPreview key={preview.review_id} {...preview} />
        ))}
      </View>
      

      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
