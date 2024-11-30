import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import Section from "@/components/profile/Section";
import { router, useLocalSearchParams } from "expo-router";
import ProfilePicture from "@/components/profile/ProfilePicture";
import { useAuthContext } from "@/components/AuthProvider";

export default function ProfilePage() {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const { userId } = useLocalSearchParams<{
    userId: string;
  }>();

  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [userReviews, setUserReviews] = useState<Review[]>();
  const loggedInUser = useAuthContext().userId;
  const [sections, setSections] = useState<Section[]>([]); //TODO depending on what we do with sections

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/profile/id/${userId}`
        );
        const profile = {
          user_id: response.data.user_id,
          username: response.data.username,
          display_name: response.data.display_name,
          bio: response.data.bio.String,
          profile_picture: response.data.profile_picture.String,
          followers: response.data.followers,
          followed: response.data.followed,
          score: response.data.score,
        };
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/reviews/user/${userId}`);
        setUserReviews(response.data);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    const fetchUserSections = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/section/${userId}`);
        setSections(response.data);
      } catch (error) {
        console.error("Error fetching user sections:", error);
      }
    };

    if (userId) {
      fetchUserProfile();
      fetchUserReviews();
      fetchUserSections();
    }
  }, [userId]);

  const handleActivityPress = () => {
    router.push("/Activity");
  };

  const handleSharePress = () => {
    console.log("Share icon pressed");
  };

  return (
    userProfile && (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.topIconsContainer}>
            <TouchableOpacity
              onPress={handleActivityPress}
              style={styles.activityIconContainer}
            >
              <Icon name="activity" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSharePress}>
              <Icon name="share" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileContainer}>
            <Image
              source={require("@/assets/images/Profile/record.png")}
              style={styles.recordImage}
            />
            <ProfilePicture uri={userProfile.profile_picture} editing={false} />
          </View>

          <Text style={styles.name}>{userProfile.display_name}</Text>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>@{userProfile.username}</Text>
          </View>
          <View style={styles.stats}>
            <View style={styles.statItemContainer}>
              <Text style={styles.statNumber}>{userProfile.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItemContainer}>
              <Text style={styles.statNumber}>{userProfile.followed}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItemContainer}>
              <Text style={styles.statNumber}>{userProfile.score}</Text>
              <Text style={styles.statLabel}>Platinum</Text>
            </View>
          </View>

          <Text style={styles.aboutMe}>{userProfile.bio}</Text>
        </View>

        {/* Sections */}
        {sections &&
          sections.map((section, index) => (
            <View key={index}>
              <Section
                title={section.title}
                items={section.items}
                isEditing={false}
                onAddItem={() => console.log("Add item")}
                onDeleteSection={() => console.log("delete section")}
                onDeleteItem={(itemIndex) => console.log("delete item")}
              />
            </View>
          ))}
      </ScrollView>
    )
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  topIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Spread the icons across the container
    alignItems: "center",
    width: SCREEN_WIDTH, // Make the container span the full width of the screen
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  activityIconContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: -2,
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "red",
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
    resizeMode: "cover",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: "#888",
  },
  usernameContainer: {
    width: 120,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },
  statItem: {
    fontSize: 14,
    color: "#666",
  },
  statItemContainer: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  aboutMe: {
    fontSize: 16,
    marginTop: 10,
    color: "#666",
  },
});
