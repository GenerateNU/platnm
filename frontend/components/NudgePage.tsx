import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import axios from "axios";
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
  artist_name: string;
  cover: string;
}

const NudgePage: React.FC<NudgePageProps> = ({
  media_type,
  media_id,
  title,
  artist_name,
  cover,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { userId, username } = useAuthContext(); // Assuming you have username in AuthProvider

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        console.log(userId);
        const response = await axios.get(
          `${BASE_URL}/users/following/${userId}`,
        );

        const mappedProfiles = response.data.map((user: any) => ({
          profile_picture: user.ProfilePicture?.Valid
            ? user.ProfilePicture.String
            : null,
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

  const handleProfileClick = async (recommendeeId: string) => {
    try {
      const payload = {
        media_type, // Using the prop values
        media_id,
        title,
        artist_name,
        cover,
        recommendee_id: recommendeeId,
        recommender_id: userId,
        recommender_username: username,
        recommender_name: username, // Replace with displayname
        recommender_picture:
          "https://t3.ftcdn.net/jpg/03/64/62/36/360_F_364623623_ERzQYfO4HHHyawYkJ16tREsizLyvcaeg.jpg",
        reaction: null,
        created_at: new Date().toISOString(), // Current timestamp
      };

      const response = await axios.post(`${BASE_URL}/recommendation/`, payload);
      console.log("Recommendation created:", response.data);
    } catch (error) {
      console.error("Error creating recommendation:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Review Published!</Text>
      <View style={styles.nudgeContainer}>
        <Text style={styles.nudgeText}>Send nudge</Text>
      </View>
      <View style={styles.artistsGrid}>
        {profiles.map((user, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleProfileClick(user.id)}
          >
            <View style={styles.artist}>
              <Image
                source={{
                  uri:
                    user.profile_picture ||
                    "https://t3.ftcdn.net/jpg/03/64/62/36/360_F_364623623_ERzQYfO4HHHyawYkJ16tREsizLyvcaeg.jpg",
                }}
                style={styles.artistCircle}
              />
              <Text style={styles.artistName}>{user.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333", // Dark background color
    padding: 20,
    borderRadius: 8,
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
  artistsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  artist: {
    alignItems: "center",
    marginBottom: 15,
    width: "30%",
  },
  artistCircle: {
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
});

export default NudgePage;
