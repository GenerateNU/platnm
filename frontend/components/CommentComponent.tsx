import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import Downvote from "@/assets/images/ReviewPreview/downvote.svg";
import Upvote from "@/assets/images/ReviewPreview/upvote.svg";
import axios from "axios";
import { useAuthContext } from "./AuthProvider";
const MusicDisk = require("../assets/images/music-disk.png");

interface CommentProps {
  comment: UserComment;
}

const CommentComponent: React.FC<CommentProps> = ({ comment }) => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { userId } = useAuthContext(); // Hardcoding - Get userId from navigation

  const [upVote, setupVote] = useState<Boolean>();
  const [downVote, setdownVote] = useState<Boolean>();
  const [upvoteCount, setUpvoteCount] = useState<number>(comment.upvotes);
  const [downvoteCount, setDownvoteCount] = useState<number>(comment.downvotes);

  const handleUpvotePress = async () => {
    if (upVote) {
      setupVote(false);
      setUpvoteCount(upvoteCount - 1);
    } else {
      ("setting true");
      setupVote(true);
      setUpvoteCount(upvoteCount + 1);
      if (downVote) {
        setdownVote(false);
        setDownvoteCount(downvoteCount - 1);
      }
    }
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
        const response = await axios.get(
          `${BASE_URL}/reviews/comment/vote/${userId}/${comment.comment_id}`,
        );
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
          onPress={() => handleUpvotePress()}
          style={styles.voteButton}
        >
          <Upvote
            width={24}
            height={24}
            fill={upVote ? "#F28037" : "#555"}
            style={{
              color: upVote ? "#F28037" : "#555",
            }}
          />
          <Text>{upvoteCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDownvotePress()}
          style={styles.voteButton}
        >
          <Downvote
            width={24}
            height={24}
            fill={downVote ? "#F28037" : "#555"}
            style={{
              color: downVote ? "#F28037" : "#555",
            }}
          />
          <Text>{downvoteCount}</Text>
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
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
});

export default CommentComponent;
