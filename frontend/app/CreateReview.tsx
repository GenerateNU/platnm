import React, { useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { Divider } from "react-native-paper";

import DateInputRating from "@/components/DateInputRating";
import StarRate from "@/components/StarRate";
import CommentRating from "@/components/CommentRating";
import SongCard from "@/components/SongCard";
import HeaderComponent from "@/components/HeaderComponent";
import DraftButton from "@/components/DraftButton";
import NextButton from "@/components/NextButton";
import { usePublishReview } from "@/hooks/usePublishReview";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

const CreateReview = () => {
  const { mediaName, mediaType, mediaId } = useLocalSearchParams<{
    mediaName: string;
    mediaType: string;
    mediaId: string;
  }>();
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const { publishReview } = usePublishReview();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <HeaderComponent title="Log Song" />
        <ScrollView>
          <SongCard mediaName={mediaName} />
          <DateInputRating />
          <Divider />
          <StarRate onRatingChange={handleRatingChange} />
          <Divider />
          <CommentRating onReviewChange={handleReviewChange} />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <DraftButton handleClick={() => handleDraftSubmit()} />
          <NextButton completed={rating !== 0} handleClick={handleNextClick} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});

export default CreateReview;
