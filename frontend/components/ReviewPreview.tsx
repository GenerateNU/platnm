import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { IconButton } from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import UpvoteIcon from "@/assets/images/upvote.svg";
import DownvoteIcon from "@/assets/images/downvote.svg";
const MusicDisk = require("../assets/images/music-disk.png");

interface ReviewPreviewProps {
  preview: Preview;
}

const ReviewPreview: React.FC<ReviewPreviewProps> = ({ preview }) => {
  
  return (
    <View style={styles.card}>
      <Image source={MusicDisk} style={styles.musicDisk} />
      <View style={styles.topLeftContainer}>
        <Image style={styles.profilePicture} source={{ uri: preview.profile_picture }} />
        <View style={styles.textContainer}>
          <Text style={styles.displayName}>{preview.display_name}</Text>
          <Text style={styles.username}>{preview.username}</Text>
        </View>
      </View>
      <View style={styles.review}>
        <StarRating
          rating={preview.rating}
          onChange={() => {}}
          emptyColor="#2C2C2C"
          color="#2C2C2C"
          animationConfig={{ scale: 1 }}
          starSize={20}
        />
        <Text style={styles.commentText}>{preview.comment}</Text>
        <View style={styles.voteContainer}>
          <IconButton
            style={styles.vote}
            onPress={() => console.log("upvote")}
            icon={UpvoteIcon}
          />
          <Text>{4}</Text>
          <IconButton
            style={styles.vote}
            onPress={() => console.log("downvote")}
            icon={DownvoteIcon}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    backgroundColor: "#C4C4C4",
    padding: 10,
    flex: 1,
    marginVertical: 20,
    alignItems: "center",
    borderRadius: 15,
  },
  musicDisk: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  textContainer: {
    flex: 1,
  },
  topLeftContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "transparent",
  },
  displayName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  username: {
    fontSize: 14,
    color: "#808080",
  },
  songName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  commentText: {
    fontSize: 14,
    marginTop: 5,
    height: "auto",
  },
  review: {
    padding: 5,
    alignSelf: "flex-start",
  },
  vote: {
    margin: 0,
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ReviewPreview;
