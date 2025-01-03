import React from "react";
import { router } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useAuthContext } from "../AuthProvider";

export interface ProfileChipProps {
  display_name: string;
  profile_picture: string;
  id: string;
}

const ProfileChip: React.FC<ProfileChipProps> = ({
  display_name,
  profile_picture,
  id,
}) => {
  const loggedInUser = useAuthContext().userId;
  const pathName = id === loggedInUser ? "/(tabs)/profile" : "/(tabs)/user";
  return (
    <TouchableOpacity
      style={styles.chipContainer}
      onPress={() =>
        router.push({
          pathname: pathName,
          params: {
            userId: id,
          },
        })
      }
    >
      <View style={styles.profileContainer}>
        <Image
          source={require("@/assets/images/Profile/record.png")}
          style={styles.recordImage}
        />
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: profile_picture }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.nameText}>{display_name}</Text>
        <Text style={styles.profileText}>Profile</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
    marginVertical: 10,
  },
  profileContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  recordImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  profileImageContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
  },
  nameText: {
    position: "absolute",
    bottom: -25,
    width: "100%",
    textAlign: "left",
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  profileText: {
    position: "absolute",
    bottom: -40,
    width: "100%",
    textAlign: "left",
    fontSize: 12, // Slightly smaller
    fontWeight: "400", // Lighter weight
    fontStyle: "italic", // Makes it italic
    color: "#666666", // Lighter grey color
    opacity: 0.8, // Adds slight transparency
  },
});

export default ProfileChip;
