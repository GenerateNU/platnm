import React, { useState } from "react";
import { Button, Image, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { BASE_URL } from "@env";
import ReviewStats from "@/components/media/ReviewStats";
import MediaCard from "@/components/media/MediaCard";

type User = {
  user_id: string;
  username: string;
  display_name: string;
  profile_picture: string;
  linked_account: string;
  created_at: string;
  updated_at: string;
};

export default function MediaScreen() {
  const [users, setUsers] = useState<User[]>([]);
  console.log(BASE_URL);
  // useEffect(() => {
  //   axios
  //     .get(`${BASE_URL}/users`)
  //     .then((response) => {
  //       setUsers(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

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
      <ThemedView style={styles.buttonContainer}>
        <MediaCard />
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <ThemedView style={styles.addReviewContainer}>
          <Button color={"white"} title="Add rating" />
        </ThemedView>
        <ThemedView style={styles.saveReviewContainer}>
          <Button color={"white"} title="Save" />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ReviewStats />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
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
  metadataContainer: {
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  addReviewContainer: {
    backgroundColor: "#000000",
    borderRadius: 8,
    flexGrow: 2,
    // paddingHorizontal: 48,
    padding: 8,
  },
  saveReviewContainer: {
    backgroundColor: "#444242",
    borderRadius: 8,
    flexGrow: 1,

    // paddingHorizontal: 16,
    padding: 8,
  },
});
