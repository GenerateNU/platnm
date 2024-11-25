import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { useAuthContext } from "@/components/AuthProvider";

interface Profile {
  profile_picture: string;
  name: string;
}

const NudgePage: React.FC = () => {
  const [profiles, fetchFollowing] = useState<Profile[]>([]);

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { userId } = useAuthContext();
const [following, setFollowing] = useState([]);
  
useEffect(() => {
  const fetchFollowing = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/following/${userId}`,
      );
      setFollowing(response.data);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

   fetchFollowing();
}, [])

return (
    <View style={styles.container}>
      <Text style={styles.heading}>Review Published!</Text>
      <View style={styles.nudgeContainer}>
        <Text style={styles.nudgeText}>Send nudge</Text>
      </View>
      <View style={styles.artistsGrid}>
        {profiles.map((user, index) => (
          <View key={index} style={styles.artist}>
            <Image
            source={{ uri: user.profile_picture }}
            style={styles.artistCircle}
            />
            <Text style={styles.artistName}>{user.name}</Text>
          </View>
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
