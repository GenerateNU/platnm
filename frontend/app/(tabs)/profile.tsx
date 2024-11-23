import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import Section from "@/components/profile/Section";
import ReviewCard from "@/components/ReviewCard";
import { router, useFocusEffect } from "expo-router";
import SelectSection from "@/components/profile/SelectSection";
import { useAuthContext } from "@/components/AuthProvider";
import { profile } from "console";

export default function ProfileScreen() {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [userReviews, setUserReviews] = useState<Review[]>();
  const { userId } = useAuthContext();
  const [sections, setSections] = useState<Section[]>([]); //TODO depending on what we do with sections

  const [selectSectionVisible, setSelectSectionVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SectionOption>();
  const [options, setOptions] = useState<SectionOption[]>([]);

  const hasNotification = true; // Hardcoding - Get notification status from somewhere else

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(userProfile?.bio);
  const [nextId, setNextId] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        router.push("/(tabs)/login");
      }
    }, [userId]),
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/profile/id/${userId}`);
        const profile = {
          id: response.data.user_id,
          username: response.data.username,
          display_name: response.data.display_name,
          bio: response.data.bio.String,
          profile_picture: response.data.profile_picture.String,
          followers: response.data.followers,
          followed: response.data.followed,
          score: response.data.score
        };
        setUserProfile(profile);
        setBio(response.data.bio.String);
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

    const fetchSectionOptions = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/section/options/${userId}`,
        );
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching section options:", error);
      }
    };
    fetchUserProfile();
    fetchUserReviews();
    fetchUserSections();
    fetchSectionOptions();
  }, [userId]);

  const handleActivityPress = () => {
    router.push("/Activity");
  };

  const handleOnQueuePress = () => {
    router.push("/OnQueue");
  };

  const handleSettingsPress = () => {
    router.push("/Settings");
  };

  const handleSharePress = () => {
    console.log("Share icon pressed");
  };

  const handleEditPress = () => {
    if (isEditing) {
      axios.patch(`${BASE_URL}/users/bio/${userId}`, { bio });
    }
    setIsEditing(!isEditing);
  };

  const handleSelect = (option: SectionOption) => {
    setSelectedOption(option);
    setSelectSectionVisible(false);
    const newSection = {
      section_id: nextId,
      title: `${option.title}`,
      items: [],
      search_type: option.search_type,
    };
    setOptions((prevOptions) =>
      prevOptions.filter((item) => item.title !== option.title),
    );
    setSections([...(sections || []), newSection]);
    setNextId(nextId + 1);
  };

  const handleAddSection = () => {
    setSelectSectionVisible(true);
  };

  const handleAddItem = (section: Section) => {
    console.log("Adding item to section", section.section_id);
    console.log("Selected option", section.title);
    console.log("Selected option", section.search_type);
    router.push({
      pathname: "/SectionResults",
      params: { type: section.search_type },
    });
    setSections(
      sections.map((section) => {
        if (section.section_id === section.section_id) {
          return {
            ...section,
            items: [...section.items],
          };
        }
        return section;
      }),
    );
  };

  const handleDeleteItem = (sectionId: number, itemId: number) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.section_id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section,
      ),
    );

    axios.delete(`${BASE_URL}/users/section/item`, {
      data: {
        user_id: userId,
        section_type_id: sectionId,
        section_item_id: itemId,
      },
    });
  };

  const handleDeleteSection = (id: number) => {
    const sectionToDelete = sections.find(
      (section) => section.section_id === id,
    );
    if (sectionToDelete) {
      setOptions([
        ...options,
        {
          title: sectionToDelete.title,
          search_type: sectionToDelete.search_type,
        },
      ]);
    }
    setSections(sections.filter((section) => section.section_id !== id));
    axios.delete(`${BASE_URL}/users/section`, {
      data: {
        section_type_id: id,
        user_id: userId,
      },
    });
  };

  return (
    userProfile && (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Top icons */}
          <View style={styles.topIconsContainer}>
            {/* Activity icon with notification badge */}
            <TouchableOpacity
              onPress={handleActivityPress}
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
              <Image
                source={{ uri: userProfile.profile_picture }} // Use uri for remote images
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : null}
            {/* Don't render anything if there's no profile picture */}
            <TouchableOpacity onPress={handleEditPress} style={styles.editIcon}>
              <Icon name="edit-2" size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {/* Username and Bio */}
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
                onDeleteSection={() => handleDeleteSection(section.section_id)}
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
  profileImage: {
    position: "absolute", // Overlay the profile picture on the record
    width: 60, // Adjust size to fit within the center of the record
    height: 60, // Adjust size to fit within the center of the record
    borderRadius: 30, // To make it circular
    borderWidth: 2, // Optional: add a border around the profile image
    borderColor: "#fff", // Optional: white border
  },
  editIcon: {
    position: "absolute",
    right: -25,
    bottom: 20,
    backgroundColor: "transparent",
    padding: 4,
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
    marginVertical: 20,
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
});
