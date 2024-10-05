import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { DateInputRating } from "@/components/DateInputRating";
import { StarRating } from "@/components/StarRating";
import { CommentRating } from "@/components/CommentRating";
import { Divider } from "react-native-paper";

function reviews() {
  return (
    <View>
      <Text>Reviews</Text>
      <Divider />
      <DateInputRating/>
      <Divider />
      <StarRating/>
      <Divider />
      <CommentRating/>
    </View>
  );
}

export default reviews;