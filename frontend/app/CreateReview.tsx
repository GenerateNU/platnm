import React, { useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
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

import DateInputRating from "@/components/DateInputRating";
import SongCard from "@/components/SongCard";
import HeaderComponent from "@/components/HeaderComponent";
import DraftButton from "@/components/DraftButton";
import PublishButton from "@/components/PublishButton";
import RatingSlider from "@/components/media/RatingSlider";
import { usePublishReview } from "@/hooks/usePublishReview";
import TagSelector from "@/components/media/TagSelector";
import Divider from "@/components/Divider";

const CreateReview = () => {
  const { mediaName, mediaType, mediaId, cover, artistName } =
    useLocalSearchParams<{
      mediaName: string;
      mediaType: string;
      mediaId: string;
      cover: string;
      artistName: string;
    }>();

  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { publishReview } = usePublishReview();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      const newTags = selectedTags.filter((selectedTag) => selectedTag !== tag);
      setSelectedTags(newTags);
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDraftSubmit = () => {
    publishReview(mediaType, parseInt(mediaId), review, rating, true);
  };

  const handlePublish = () => {
    publishReview(mediaType, parseInt(mediaId), review, rating, false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <ScrollView contentContainerStyle={styles.scrollview}>
            <HeaderComponent title="Log Song" />
            <SongCard
              mediaName={mediaName}
              mediaType={mediaType}
              cover={cover}
              artistName={artistName}
            />
            <RatingSlider onRatingChange={handleRatingChange} />
            <DateInputRating />
            <Divider />
            <TextInput
              style={styles.textInput}
              multiline={true}
              placeholderTextColor="#434343"
              placeholder="Provide your thoughts..."
              value={review}
              onChangeText={setReview}
            />
            <Divider />

            <TagSelector handleTagSelect={handleTagSelect} />
            <View style={styles.buttonContainer}>
              <DraftButton handleClick={() => handleDraftSubmit()} />
              <PublishButton handleClick={handlePublish} />
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  textInput: {
    height: 50,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    color: "#434343",
    fontSize: 16,
    textAlignVertical: "top",
    justifyContent: "flex-end",
  },
});

export default CreateReview;
