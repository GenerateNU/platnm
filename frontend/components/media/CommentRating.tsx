import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

interface CommentRatingProps {
  onReviewChange: (value: string) => void;
}

const CommentRating = ({ onReviewChange }: CommentRatingProps) => {
  const [comment, setComment] = useState("");

  const handleReview = (value: string) => {
    setComment(value);
    onReviewChange(value);
  };

  return (
    <TextInput
      style={styles.input}
      multiline
      placeholderTextColor="#434343"
      placeholder="Provide your thoughts..."
      value={comment}
      onChangeText={handleReview}
    />
  );
};

export default CommentRating;

const styles = StyleSheet.create({
  input: {
    flex: 1,
    padding: 10, // Add padding for better interaction
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    color: "#434343",
    fontSize: 19,
    textAlignVertical: "top",
    justifyContent: "flex-end",
  },
});
