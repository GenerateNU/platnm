import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { useAuthContext } from "@/components/AuthProvider";

interface Profile {
  profile_picture: string | null;
  name: string;
  id: string;
}

interface NudgePageProps {
  media_type: string;
  media_id: string;
  title: string;
  cover: string;
}

const NudgePage: React.FC<NudgePageProps> = ({
  media_type,
  media_id,
  title,
  cover,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { userId } = useAuthContext();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        console.log(userId);
        const response = await axios.get(
          `${BASE_URL}/users/following/${userId}`,
        );

        const mappedProfiles = response.data.map((user: any) => ({
          profile_picture:
            user.ProfilePicture?.Valid && user.ProfilePicture.String,
          name: user.DisplayName || user.Username,
          id: user.ID,
        }));

        setProfiles(mappedProfiles);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    fetchFollowing();
  }, [userId, BASE_URL]);

  const routeToMediaPage = () => {
    router.push({
      pathname: "/(tabs)/MediaPage",
      params: { mediaId: media_id, mediaType: media_type },
    });
  };

  const handleProfileClick = async (recommendeeId: string) => {
    try {
      const payload = {
        media_type,
        media_id,
        title,
        cover,
        recommendee_id: recommendeeId,
        recommender_id: userId,
      };

      await axios.post(`${BASE_URL}/recommendation`, payload);
    } catch (error) {
      console.error("Error creating recommendation:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.heading}>Review Published!</Text>
        <View style={styles.nudgeContainer}>
          <Text style={styles.nudgeText}>Send nudge</Text>
        </View>
        <View style={styles.followingGrid}>
          {profiles.map((user, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleProfileClick(user.id)}
            >
              <View style={styles.followingUser}>
                <Image
                  source={{
                    uri:
                      user.profile_picture ||
                      "https://t3.ftcdn.net/jpg/03/64/62/36/360_F_364623623_ERzQYfO4HHHyawYkJ16tREsizLyvcaeg.jpg",
                  }}
                  style={styles.followingUserCircle}
                />
                <Text style={styles.artistName}>{user.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Text style={styles.text} onPress={routeToMediaPage}>
        Done
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333", // Dark background color
    padding: 20,
    borderRadius: 8,
  },
  center: {
    alignItems: "center",
  },
  heading: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  nudgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 8,
  },
  nudgeText: {
    color: "white",
    fontSize: 14,
  },
  followingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  followingUser: {
    alignItems: "center",
    marginBottom: 15,
  },
  followingUserCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
    marginBottom: 5,
  },
  artistName: {
    color: "white",
    fontSize: 12,
  },
  text: {
    color: "white",
    textAlign: "right",
  },
});

export default NudgePage;
