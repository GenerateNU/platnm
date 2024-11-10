import React, { useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { Divider } from "react-native-paper";

import DateInputRating from "@/components/DateInputRating";
import CommentRating from "@/components/CommentRating";
import SongCard from "@/components/SongCard";
import HeaderComponent from "@/components/HeaderComponent";
import DraftButton from "@/components/DraftButton";
import NextButton from "@/components/NextButton";
import RatingSlider from "@/components/media/RatingSlider";
import { usePublishReview } from "@/hooks/usePublishReview";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

const CreateReview = () => {
  const { mediaName, mediaType, mediaId, cover, artistName } =
    useLocalSearchParams<{
      mediaName: string;
      mediaType: string;
      mediaId: string;
      cover: string;
      artistName: string;
    }>();

  console.log(mediaName, mediaType, mediaId, cover, artistName);
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { publishReview } = usePublishReview();

  const handleDraftSubmit = () => {
    publishReview(mediaType, parseInt(mediaId), review, rating, true);
  };

  const handleRatingChange = (newRating: Double) => {
    setRating(newRating);
  };

  const handleReviewChange = (newReview: string) => {
    setReview(newReview);
  };

  const handleNextClick = () => {
    if (rating !== 0) {
      navigation.navigate("PreviewReview", {
        rating: rating * 2, // to handle current 1-5 vs. 1-10 scale
        review,
        mediaName,
        mediaType,
        mediaId,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // Adjusted offset as needed
    >
      <TouchableWithoutFeedback
        style={styles.innerContainer}
        onPress={Keyboard.dismiss}
      >
        <View>
          <HeaderComponent title="Log Song" />
          <ScrollView
            contentContainerStyle={styles.scrollview}
            keyboardShouldPersistTaps="handled"
          >
            <SongCard
              mediaName={mediaName}
              mediaType={mediaType}
              cover={cover}
              artistName={artistName}
            />
            <Divider />
            <RatingSlider />
            <DateInputRating />
            <CommentRating onReviewChange={handleReviewChange} />
          </ScrollView>
          <View style={styles.buttonContainer}>
            <DraftButton handleClick={() => handleDraftSubmit()} />
            <NextButton
              completed={rating !== 0}
              handleClick={handleNextClick}
            />
          </View>
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
  innerContainer: {
    flex: 1,
    justifyContent: "flex-end",
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
    padding: 20,
  },
});

export default CreateReview;
