import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import UpvoteIcon from "@/assets/images/upvote.svg";
import DownvoteIcon from "@/assets/images/downvote.svg";
const MusicDisk = require("../assets/images/music-disk.png");

interface CommentProps {
  comment: UserComment;
}

const CommentComponent: React.FC<CommentProps> = ({ comment }) => {
  const Upvotes = require("../assets/images/ReviewPreview/upvote.png");
  const Downvotes = require("../assets/images/ReviewPreview/downvote.png");

  const handleUpvotePress = () => {
    console.log("upvote icon pressed");
  };

  const handleDownvotePress = () => {
    console.log("downvote icon pressed");
  };

  const handleReplyPress = () => {
    console.log("reply pressed");
  };

  return (
    <View style={styles.card}>
      <Image source={MusicDisk} style={styles.musicDisk} />
      <View style={styles.topLeftContainer}>
        <Image
          style={styles.profilePicture}
          source={{ uri: comment.profile_picture }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.displayName}>{comment.display_name}</Text>
          <Text style={styles.username}>{comment.username}</Text>
        </View>
      </View>
      <View style={styles.review}>
        <Text style={styles.commentText}>{comment.comment}</Text>
        <View style={styles.voteContainer}>
          {/* <IconButton
            style={styles.vote}
            onPress={() => console.log("upvote")}
            icon={UpvoteIcon}
          />
          <Text>{4}</Text>
          <IconButton
            style={styles.vote}
            onPress={() => console.log("downvote")}
            icon={DownvoteIcon}
          /> */}
          <TouchableOpacity onPress={handleUpvotePress}>
            <Image source={Upvotes} style={styles.voteIcon} />
          </TouchableOpacity>
          <Text>{2}</Text>
          <TouchableOpacity onPress={handleDownvotePress}>
            <Image source={Downvotes} style={styles.voteIcon} />
          </TouchableOpacity>
          <Text>{3}</Text>
          <TouchableOpacity onPress={handleReplyPress}>
            <Text style={styles.reply}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    marginVertical: 20,
    borderRadius: 15,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: "flex-start",
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
  voteIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  reply: {
    marginHorizontal: 10,
  },
});

export default CommentComponent;
