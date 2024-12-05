import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Section from "@/components/profile/Section";
import SelectSection from "@/components/profile/SelectSection";
import ProfilePicture from "@/components/profile/ProfilePicture";
import { useAuthContext } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";

export default function ProfileScreen() {
  const userId = useAuthContext().userId;
  const {
    userProfile,
    sections,
    bio,
    setBio,
    isEditing,
    hasNotification,
    selectSectionVisible,
    setSelectSectionVisible,
    options,
    handleEditPress,
    handleActivityPress,
    handleSettingsPress,
    handleSharePress,
    handleOnQueuePress,
    handleAddItem,
    handleDeleteSection,
    handleDeleteItem,
    handleAddSection,
    handleSelect,
  } = useProfile(userId);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<User[]>([]);
  const [modalTitle, setModalTitle] = useState("");
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [followingList, setFollowingList] = useState<User[]>([]);
  const [followerList, setFollowerList] = useState<User[]>([]);

  const openModal = (list: User[], title: string) => {
    setModalData(list);
    setModalTitle(title);
    setModalVisible(true);
  };

  const fetchFollowing = async () => {
    const response = await axios.get(`${BASE_URL}/users/${userId}/connections`);
    const followerList = response.data.followers;
    const followingList = response.data.followees;
    setFollowerList(followerList);
    setFollowingList(followingList);
  };

  useFocusEffect(
    useCallback(() => {
      fetchFollowing();
    }, []),
  );

  const navigateToProfile = (user: User) => {
    // Navigate to the selected user's profile
    const pathName =
      user.user_id === userId ? "/(tabs)/profile" : "/(tabs)/user";
    router.push({
      pathname: pathName,
      params: {
        userId: user.user_id,
      },
    });
  };

  return (
    userProfile && (
      <View style={styles.page}>
        <TouchableOpacity onPress={handleEditPress} style={styles.editIcon}>
          <Icon name="edit-2" size={20} color="#888" />
        </TouchableOpacity>
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            {/* Top icons */}
            <View style={styles.topIconsContainer}>
              {/* Activity icon with notification badge */}
              <TouchableOpacity
                onPress={() => handleActivityPress(userId)}
                style={styles.activityIconContainer}
              >
                <Icon name="activity" size={24} color="#000" />
                {hasNotification && <View style={styles.notificationBadge} />}
              </TouchableOpacity>

              {/* Grouping the settings and share icons on the right */}
              <View style={styles.rightIconsContainer}>
                <TouchableOpacity onPress={handleSettingsPress}>
                  <Icon
                    name="settings"
                    size={24}
                    color="#000"
                    style={styles.rightIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSharePress}>
                  <Icon
                    name="share"
                    size={24}
                    color="#000"
                    style={styles.rightIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Profile Picture */}
            <View style={styles.profileContainer}>
              <Image
                source={require("@/assets/images/Profile/record.png")}
                style={styles.recordImage}
              />
              {userProfile.profile_picture ? ( // Check if profilePicture exists
                <ProfilePicture
                  uri={userProfile.profile_picture}
                  editing={isEditing}
                />
              ) : null}
              {/* Don't render anything if there's no profile picture */}
            </View>
            {/* Username and Bio */}
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
            {/* Bio */}
            {isEditing ? (
              <TextInput
                value={bio}
                onChangeText={setBio}
                style={styles.aboutMeInput}
                multiline
              />
            ) : (
              <Text style={styles.aboutMe}>
                {bio == "" ? "About me..." : bio}
              </Text>
            )}
          </View>

          {/* On Queue Button */}
          <TouchableOpacity
            style={styles.queueButton}
            onPress={handleOnQueuePress}
          >
            <Text style={styles.queueButtonText}>▶ On Queue</Text>
          </TouchableOpacity>

          {/* Sections */}
          {sections &&
            sections.map((section, index) => (
              <View key={index}>
                <Section
                  title={section.title}
                  items={section.items}
                  isEditing={isEditing}
                  onAddItem={() => handleAddItem(section)}
                  onDeleteSection={() =>
                    handleDeleteSection(section.section_id)
                  }
                  onDeleteItem={(itemIndex) =>
                    handleDeleteItem(section.section_id, itemIndex)
                  }
                />
              </View>
            ))}
          {/* Button to Add a New Section */}
          {isEditing && (
            <TouchableOpacity
              onPress={handleAddSection}
              style={styles.addSectionButton}
            >
              <Text style={styles.addSectionButtonText}>Add Section</Text>
              <Icon name="plus-circle" size={24} color="#000" />
            </TouchableOpacity>
          )}
          {/* <SelectSection/> */}
          <SelectSection
            visible={selectSectionVisible}
            onClose={() => setSelectSectionVisible(false)}
            onSelect={handleSelect}
            options={options}
          />
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
      </View>
    )
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
    minHeight: Dimensions.get("window").height - 80,
  },
  container: {
    paddingHorizontal: 24,
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
    position: "relative", // Necessary for absolute positioning of the badge
  },
  notificationBadge: {
    position: "absolute",
    top: 5, // Adjust the position as needed
    right: -2,
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "red",
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightIcon: {
    marginLeft: 15, // Adds spacing between settings and share icons
  },
  profileContainer: {
    width: 120, // Adjust size to match your record image
    height: 120, // Adjust size to match your record image
    alignItems: "center",
    justifyContent: "center",
  },
  recordImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  editIcon: {
    zIndex: 10,
    position: "absolute",
    backgroundColor: "#f0f0f0",
    padding: 20,
    right: 24,
    bottom: 24,
    borderRadius: 50,
  },
  editText: {
    fontSize: 16,
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
  aboutMeInput: {
    width: "80%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
    color: "#666",
    backgroundColor: "#ddd",
    textAlign: "center",
  },
  queueButton: {
    backgroundColor: "#F28037",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  queueButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  itemsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    width: "100%",
  },
  itemTitle: {
    fontSize: 16,
  },
  noReviewsText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
  addSectionButton: {
    backgroundColor: "#888",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    alignSelf: "center",
  },
  addSectionButtonText: {
    color: "#000",
    fontSize: 16,
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
