import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import DateInputRating from "@/components/DateInputRating";
import StarRate from "@/components/StarRate";
import CommentRating from "@/components/CommentRating";
import { Divider } from "react-native-paper";
import { useNavigation } from "expo-router";
import SongCard from "@/components/SongCard";
import HeaderComponent from "@/components/HeaderComponent";
import DraftButton from "@/components/DraftButton";
import NextButton from "@/components/NextButton";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

const Reviews = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleRatingChange = (newRating: Double) => {
    setRating(newRating);
  };

  const handleReviewChange = (newReview: string) => {
    setReview(newReview);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container}>
        <View>
          <HeaderComponent title="Log Song" />
          <SongCard />
          <DateInputRating />
          <Divider />
          <StarRate onRatingChange={handleRatingChange} />
          <Divider />
          <CommentRating onReviewChange={handleReviewChange} />
          <View style={styles.buttonContainer}>
            <DraftButton />
            <NextButton
              completed={rating !== 0}
              rating={rating}
              review={review}
            />
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default Reviews;
