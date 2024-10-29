import { useState, useEffect, useCallback } from "react";
import { Button, StyleSheet, ScrollView, View, SafeAreaView } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import MediaCard from "@/components/media/MediaCard";
import ReviewStats from "@/components/media/ReviewStats";
import axios from "axios";
import { useFocusEffect, useNavigation } from "expo-router";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import OnboardingHeader from "@/components/onboarding/Header";

export default function ArtistSearch() {

    // useFocusEffect(
    //     useCallback(() => {

    //     }, [media]),
    //   );

    <SafeAreaView style={styles.outerContainer}>
        <OnboardingHeader title="Favorite Artists" subtitle="Pick up to 5 of your favorite artists" />
        <ScrollView>
          
        </ScrollView>

    </SafeAreaView>

}

const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    container: {
      flex: 1,
      marginTop: 230,
      marginHorizontal: 22,
      gap: 65,
      backgroundColor: "#FFFFFF",
      color: "black",
    },
    input: {
      height: 50,
      borderWidth: 1,
      width: "100%",
      borderColor: "#33333314",
      borderRadius: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      marginBottom: 20,
    },
    eyeIcon: {
      position: "absolute",
      right: 15,
      top: 15,
    },
    stickyContainer: {
      position: "absolute",
      bottom: 80,
      width: "100%",
      alignItems: "center",
    },
    buttonGroup: {
      width: "100%",
      gap: 22,
    },
    errorText: {
      color: "#8b0000",
      fontSize: 14,
      position: "absolute",
      bottom: 72,
      paddingHorizontal: 5,
    },
  });
  