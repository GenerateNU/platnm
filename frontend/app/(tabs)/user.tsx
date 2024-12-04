import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Modal,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import Section from "@/components/profile/Section";
import ProfilePicture from "@/components/profile/ProfilePicture";
import { useProfile } from "@/hooks/useProfile";
import { useAuthContext } from "@/components/AuthProvider";
import axios from "axios";
import { set } from "react-native-reanimated";

export default function ProfilePage() {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const { userId } = useLocalSearchParams<{
    userId: string;
  }>();
  const loggedInUser = useAuthContext().userId;

  const { userProfile, handleActivityPress, handleSharePress, sections } =
    useProfile(userId);
  const [following, setFollowing] = useState(false);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [followerList, setFollowerList] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<User[]>([]);
  const [modalTitle, setModalTitle] = useState("");

  const handleFollowToggle = async () => {
    // Toggle the following state
    const response = await axios.post(`${BASE_URL}/users/follow`, {
      follower_id: loggedInUser,
      following_id: userId,
    });
    await fetchFollowing();
  };

  const fetchFollowing = async () => {
    const response = await axios.get(`${BASE_URL}/users/${userId}/connections`);
    const followerList = response.data.followers;
    const followingList = response.data.followees;
    setFollowerList(followerList);
    setFollowingList(followingList);
    setFollowing(false);
    for (const f of followerList) {
      if (f.user_id === loggedInUser) {
        setFollowing(true);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFollowing();
    }, [userId]),
  );

  const openModal = (list: User[], title: string) => {
    setModalData(list);
    setModalTitle(title);
    setModalVisible(true);
  };

  const navigateToProfile = (user: User) => {
    // Navigate to the selected user's profile
    const pathName =
      user.user_id === loggedInUser ? "/(tabs)/profile" : "/(tabs)/user";
    router.push({
      pathname: pathName,
      params: {
        userId: user.user_id,
      },
    });
  };

  return (
    userProfile && (
      <>
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
              <ProfilePicture
                uri={userProfile.profile_picture}
                editing={false}
              />
            </View>

            <Text style={styles.name}>{userProfile.display_name}</Text>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>@{userProfile.username}</Text>
            </View>
            <View style={styles.stats}>
              <TouchableOpacity
                onPress={() => openModal(followerList, "Followers")}
                style={styles.statItemContainer}
              >
                <Text style={styles.statNumber}>{followerList.length}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openModal(followingList, "Following")}
                style={styles.statItemContainer}
              >
                <Text style={styles.statNumber}>{followingList.length}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
              <View style={styles.statItemContainer}>
                <Text style={styles.statNumber}>{userProfile.score}</Text>
                <Text style={styles.statLabel}>Platinum</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleFollowToggle}>
              <View style={styles.followButton}>
                <Text style={styles.followButtonText}>
                  {following ? "Following" : "Follow"}
                </Text>
              </View>
            </TouchableOpacity>

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
        {/* Modal */}
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <FlatList
              data={modalData}
              keyExtractor={(item) => item.user_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    navigateToProfile(item);
                  }}
                  style={styles.userItem}
                >
                  {item.profile_picture ? (
                    <Image
                      source={{ uri: item.profile_picture }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderImage} />
                  )}
                  <View style={styles.userInfoContainer}>
                    <Text style={styles.displayName}>{item.display_name}</Text>
                    <Text style={styles.userName}>{item.username}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </>
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
  followButton: {
    backgroundColor: "#d3d3d3", // Grey background
    borderRadius: 20, // Rounded corners
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  followButtonText: {
    color: "#000", // Black text
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 50,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  userName: {
    marginLeft: 10,
    fontSize: 16,
  },
  displayName: {
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#d3d3d3", // Light grey color
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#d3d3d3",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButtonText: {
    fontWeight: "bold",
  },
  userInfoContainer: {
    flex: 1,
    flexDirection: "column",
  },
});
