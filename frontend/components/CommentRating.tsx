import { useEffect, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";

interface StarRateProps {
  onReviewChange: (value: string) => void;
}

const CommentRating = ({ onReviewChange }: StarRateProps) => {
  const [comment, setComment] = useState("");

  const handleReview = (value: string) => {
    setComment(value);
    onReviewChange(value);
  };

  return (
    <View style={styles.comment}>
      <TextInput
        style={styles.input}
        multiline={true}
        placeholderTextColor="#434343"
        placeholder="Provide your thoughts..."
        value={comment}
        onChangeText={handleReview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    padding: 20,
    color: "#434343",
    fontSize: 19,
    height: "35%",
  },
  input: {
    flex: 1,
    textAlignVertical: "top",
    padding: 0,
  },
});

export default CommentRating;
