import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import HeaderComponent from "@/components/HeaderComponent";
import DraftButton from "@/components/DraftButton";
import PublishButton from "@/components/PublishButton";
import { usePublishReview } from "@/hooks/usePublishReview";
import TagSelector from "@/components/media/TagSelector";
import Divider from "@/components/Divider";
import NudgePage from "@/components/NudgePage";
import MediaCard from "@/components/media/MediaCard";
import axios from "axios";
import { useAuthContext } from "@/components/AuthProvider";

const CreateReview = () => {
  const { mediaType, mediaId, rating } = useLocalSearchParams<{
    mediaType: string;
    mediaId: string;
    rating: string;
  }>();
  const userId = useAuthContext().userId;
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [media, setMedia] = useState<Media>();
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showNudges, setShowNudges] = useState(false);

  const { publishReview } = usePublishReview();

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      const newTags = selectedTags.filter((selectedTag) => selectedTag !== tag);
      setSelectedTags(newTags);
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (draft: boolean) => {
    const request = {
      user_id: userId,
      media_type: mediaType,
      media_id: parseInt(mediaId),
      rating: parseInt(rating),
      tags: selectedTags,
      title,
      comment,
      draft,
    };
    publishReview(request);
    if (!draft) {
      setShowNudges(true);
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/media/${mediaType}/${mediaId}`)
      .then((response) => setMedia(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    media && (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust this value as needed
          >
            <HeaderComponent title="Log Song" centered />
            <View style={styles.inner}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <MediaCard
                  media={media}
                  showTopBar={false}
                  showRateButton={false}
                />
                <View style={styles.scrollview}>
                  <View>
                    <TextInput
                      style={styles.titleInput}
                      multiline={true}
                      placeholderTextColor="#434343"
                      placeholder="Add a title..."
                      value={title}
                      onChangeText={setTitle}
                    />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    multiline={true}
                    placeholderTextColor="#434343"
                    placeholder="What do you want to talk about?"
                    value={comment}
                    onChangeText={setComment}
                  />
                  <Divider />
                  <TagSelector
                    tags={selectedTags}
                    handleTagSelect={handleTagSelect}
                  />
                  <View style={styles.buttonContainer}>
                    <DraftButton handleClick={() => handleSubmit(true)} />
                    <PublishButton handleClick={() => handleSubmit(false)} />
                  </View>
                </View>
              </ScrollView>
              {showNudges && (
                <NudgePage
                  media_type={mediaType}
                  media_id={mediaId}
                  title={media.title}
                  artist_name={media.artist_name}
                  cover={media.cover}
                />
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  inner: {
    flex: 1,
    paddingTop: 20,
  },
  scrollview: {
    flexGrow: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 30,
    paddingTop: 15,
  },
  titleInput: {
    backgroundColor: "#ffffff",
    color: "#434343",
    fontWeight: "bold",
    fontSize: 16,
  },
  textInput: {
    height: 80,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    color: "#434343",
    fontSize: 16,
    textAlignVertical: "top",
    justifyContent: "flex-end",
  },
  sliderWrapper: {
    marginBottom: 20,
    width: "100%",
  },
});

export default CreateReview;
