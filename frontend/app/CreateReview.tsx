import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import HeaderComponent from "@/components/HeaderComponent";
import TagSelector from "@/components/media/TagSelector";
import Divider from "@/components/Divider";
import NudgePage from "@/components/media/NudgePage";
import RateFlowButton from "@/components/media/RateFlowButton";
import { useAuthContext } from "@/components/AuthProvider";
import MediaCollapsed from "@/components/media/MediaCollapsed";
import { usePublishReview } from "@/hooks/usePublishReview";

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
          >
            <HeaderComponent title="Log Song" centered />
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.inner}
            >
              <MediaCollapsed media={media} />
              <View style={styles.scrollview}>
                <TextInput
                  style={styles.titleInput}
                  multiline={true}
                  placeholderTextColor="#434343"
                  placeholder="Add a title..."
                  value={title}
                  onChangeText={setTitle}
                />
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
                  <RateFlowButton
                    text="Drafts"
                    primary={false}
                    handleClick={() => handleSubmit(true)}
                  />
                  <RateFlowButton
                    text="Publish"
                    iconName="arrow-up"
                    handleClick={() => handleSubmit(false)}
                  />
                </View>
              </View>
            </ScrollView>
            {showNudges && (
              <NudgePage
                media_type={mediaType}
                media_id={mediaId}
                title={media.title}
                cover={media.cover}
              />
            )}
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
    justifyContent: "space-between",
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
    height: 150,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    color: "#434343",
    fontSize: 16,
    textAlignVertical: "top",
  },
});

export default CreateReview;
