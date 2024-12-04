import { useState, useCallback, useEffect } from "react";
import { useFocusEffect, router } from "expo-router";
import axios from "axios";

export function useProfile(userId: string) {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [userReviews, setUserReviews] = useState<Review[]>();
  const [sections, setSections] = useState<Section[]>([]);
  const [selectSectionVisible, setSelectSectionVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SectionOption>();
  const [options, setOptions] = useState<SectionOption[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(userProfile?.bio);

  const hasNotification = true; // Hardcoding - Get notification status from somewhere else

  useFocusEffect(
    useCallback(() => {
      if (!userId) router.push("/(tabs)/login");
    }, [userId]),
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/profile/id/${userId}`,
        );
        console.log("Profile:", response.data);
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

    if (userId) {
      fetchUserProfile();
      fetchUserReviews();
      fetchUserSections();
      fetchSectionOptions();
    }
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
      section_id: option.section_id,
      title: `${option.title}`,
      items: [],
      search_type: option.search_type,
    };
    setOptions((prevOptions) =>
      prevOptions.filter((item) => item.title !== option.title),
    );
    setSections([...(sections || []), newSection]);
  };

  const handleAddSection = () => {
    setSelectSectionVisible(true);
  };

  const handleAddItem = (section: Section) => {
    router.push({
      pathname: "/SectionResults",
      params: { type: section.search_type, sectionId: section.section_id },
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
          section_id: sectionToDelete.section_id,
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

  return {
    userProfile,
    userReviews,
    sections,
    selectSectionVisible,
    setSelectSectionVisible,
    selectedOption,
    options,
    hasNotification,
    isEditing,
    bio,
    setBio,
    handleActivityPress,
    handleOnQueuePress,
    handleSettingsPress,
    handleSharePress,
    handleEditPress,
    handleSelect,
    handleAddSection,
    handleAddItem,
    handleDeleteItem,
    handleDeleteSection,
  };
}
