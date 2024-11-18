import React from "react";
import { router } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";

export interface ProfileChipProps {
    display_name: string;
    profile_picture: string;
    id: string;
};

const ProfileChip: React.FC<ProfileChipProps> = ({
  display_name,
  profile_picture,
  id,
}) => {

      return (
<TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/profile",
          params: {
            userID: id,
          },
        })
      }
    >
        <Image
              source={require("@/assets/images/Profile/record.png")}
              style={styles.recordImage}
            />
            {profile_picture ? (
              <Image
                source={{ uri: profile_picture }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : null}
        <Text>{display_name}</Text>
        <Text>Profile</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 24,
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
  recordImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileImage: {
    position: "absolute", // Overlay the profile picture on the record
    width: 60, // Adjust size to fit within the center of the record
    height: 60, // Adjust size to fit within the center of the record
    borderRadius: 30, // To make it circular
    borderWidth: 2, // Optional: add a border around the profile image
    borderColor: "#fff", // Optional: white border
  },
});

export default ProfileChip;
