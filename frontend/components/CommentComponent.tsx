import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import UpvoteIcon from "@/assets/images/upvote.svg";
import DownvoteIcon from "@/assets/images/downvote.svg";
import axios from "axios";
const MusicDisk = require("../assets/images/music-disk.png");

interface CommentProps {
  comment: UserComment;
}

const CommentComponent: React.FC<CommentProps> = ({ comment }) => {
  const Upvotes = require("../assets/images/ReviewPreview/upvote.png");
  const Downvotes = require("../assets/images/ReviewPreview/downvote.png");
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const userId = "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e"; // Hardcoding - Get userId from navigation

  const [upVote, setupVote] = useState<Boolean>();
  const [downVote, setdownVote] = useState<Boolean>();
  const [upvoteCount, setUpvoteCount] = useState<number>(comment.upvotes);
  const [downvoteCount, setDownvoteCount] = useState<number>(comment.downvotes);

  const handleUpvotePress = async () => {
    console.log("upvote icon pressed");
    if (upVote) {
      setupVote(false);
      setUpvoteCount(upvoteCount - 1);
    } else {
      setupVote(true);
      setUpvoteCount(upvoteCount + 1);
      if (downVote) {
        setdownVote(false);
        setDownvoteCount(downvoteCount - 1);
      }
    }
    console.log(upVote);
    try {
      await axios.post(`${BASE_URL}/reviews/comment/vote`, {
        user_id: userId,
        post_id: comment.comment_id,
        upvote: true,
      });
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  const handleDownvotePress = async () => {
    console.log("downvote icon pressed");
    console.log(comment.comment_id);
    if (downVote) {
      setdownVote(false);
      setDownvoteCount(downvoteCount - 1);
    } else {
      setdownVote(true);
      setDownvoteCount(downvoteCount + 1);
      if (upVote) {
        setupVote(false);
        setUpvoteCount(upvoteCount - 1);
      }
    }

    try {
      await axios.post(`${BASE_URL}/reviews/comment/vote`, {
        user_id: userId,
        post_id: comment.comment_id,
        upvote: false,
      });
    } catch (error) {
      console.error("Error downvoting comment:", error);
    }
  };

  useEffect(() => {
    const fetchVote = async () => {
      try {
        console.log("Fetching vote");
        console.log(userId);
        console.log(comment.comment_id);
        const response = await axios.get(
          `${BASE_URL}/reviews/comment/vote/${userId}/${comment.comment_id}`,
        );
        console.log(response.data);
        if (response.data) {
          const { upvote } = response.data; // Assuming the API returns { user_id, post_id, upvote }
          if (upvote === true) {
            setupVote(true);
            setdownVote(false);
          } else if (upvote === false) {
            setupVote(false);
            setdownVote(true);
          } else {
            setupVote(false);
            setdownVote(false);
          }
        } else {
          setupVote(false);
          setdownVote(false);
        }
      } catch (error) {
        console.error("Error fetching vote:", error);
      }
    };

    fetchVote();
  }, [comment.comment_id, downVote, upVote]);

  return (
    <View style={styles.card}>
      {/* User Details */}
      <View style={styles.header}>
        {/* Conditionally render profile picture or grey circle */}
        {comment.profile_picture ? (
          <Image
            style={styles.profilePicture}
            source={{ uri: comment.profile_picture }}
          />
        ) : (
          <View style={styles.profilePicturePlaceholder} />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>{comment.display_name}</Text>
          <Text style={styles.username}>@{comment.username}</Text>
        </View>
      </View>

      {/* Comment Text */}
      <Text style={styles.commentText}>{comment.comment}</Text>

      {/* Actions Section */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleUpvotePress}
          style={styles.actionButton}
        >
          <Image
            source={Upvotes}
            style={[
              styles.voteIcon,
              { tintColor: upVote ? "#FFD700" : "#555" }, // Highlight if upvoted
            ]}
          />
          <Text style={styles.voteCount}>{upvoteCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDownvotePress}
          style={styles.actionButton}
        >
          <Image
            source={Downvotes}
            style={[
              styles.voteIcon,
              { tintColor: downVote ? "#FFD700" : "#555" }, // Highlight if downvoted
            ]}
          />
          <Text style={styles.voteCount}>{downvoteCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FAFAFA",
    padding: 20,
    width: "100%",
    alignSelf: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#DDD", // Line color
  },
  line: {
    height: 1,
    backgroundColor: "#DDD", // Line color
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profilePicturePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#D3D3D3", // Light grey color for placeholder
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "column",
  },
  displayName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  username: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  commentText: {
    fontSize: 15,
    color: "#444",
    marginVertical: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  voteIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  voteCount: {
    fontSize: 14,
    color: "#555",
  },
});

export default CommentComponent;
