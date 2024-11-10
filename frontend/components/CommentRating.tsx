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
    <TouchableWithoutFeedback style={styles.comment} onPress={Keyboard.dismiss}>
      <TextInput
        style={styles.input}
        multiline={true}
        placeholderTextColor="#434343"
        placeholder="Provide your thoughts..."
        value={comment}
        onChangeText={handleReview}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  comment: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    color: "#434343",
    fontSize: 19,
  },
  input: {
    flex: 1,
    textAlignVertical: "top",
    padding: 0,
  },
});

export default CommentRating;
