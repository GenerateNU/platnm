import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const MusicDisk = require("../assets/images/music-disk.png");
const Comments = require("../assets/images/ReviewPreview/comments.png");
const Upvotes = require("../assets/images/ReviewPreview/upvote.png");
const Downvotes = require("../assets/images/ReviewPreview/downvote.png");
const Share = require("../assets/images/ReviewPreview/share.png");

const ratingImages = {
  0: require("../assets/images/Ratings/0Rating.png"),
  1: require("../assets/images/Ratings/1Rating.png"),
  2: require("../assets/images/Ratings/2Rating.png"),
  3: require("../assets/images/Ratings/3Rating.png"),
  4: require("../assets/images/Ratings/4Rating.png"),
  5: require("../assets/images/Ratings/5Rating.png"),
  6: require("../assets/images/Ratings/6Rating.png"),
  7: require("../assets/images/Ratings/7Rating.png"),
  8: require("../assets/images/Ratings/8Rating.png"),
  9: require("../assets/images/Ratings/9Rating.png"),
  10: require("../assets/images/Ratings/10Rating.png"),
};

interface PreviewProps {
  preview: Preview;
}

const ReviewPreview: React.FC<PreviewProps> = ({ preview }) => {
  const [showFullComment, setShowFullComment] = useState(false);

  const [currentVote, setCurrentVote] = useState<boolean>(false); // does a vote currently exist?
  const [currentVoteValue, setCurrentVoteValue] = useState<boolean>(false); // what is the current vote's value?

  const [upvoteCount, setUpvoteCount] = useState<number>(
    preview.review_stat.upvotes
  );
  const [downvoteCount, setDownvoteCount] = useState<number>(
    preview.review_stat.downvotes
  );
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const user_Id = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // Hardcoding - Get userId from navigation

  const getRatingImage = (rating: keyof typeof ratingImages) => {
    return ratingImages[rating];
  };

  const handleUpvotePress = async () => {
    if (!currentVote) {
      setCurrentVote(true);
      setCurrentVoteValue(true);
      setUpvoteCount(upvoteCount + 1);
    } else if (currentVote && currentVoteValue) {
      // if there's already a vote and it's an upvote, cancel it out
      setCurrentVote(false);
      setUpvoteCount(upvoteCount - 1);
    } else {
      // if there's already a vote and it's a downvote
      setCurrentVoteValue(true);
      setUpvoteCount(upvoteCount + 1);
      setDownvoteCount(downvoteCount - 1);
    }

    try {
      await axios.post(`${BASE_URL}/reviews/vote`, {
        user_id: user_Id,
        post_id: String(preview.review_id),
        upvote: true,
      });
      // Sync upvote with review page or feed
    } catch (error) {
      console.error("Error upvoting review:", error);
    }
  };

  const handleDownvotePress = async () => {
    if (!currentVote) {
      setCurrentVote(true);
      setCurrentVoteValue(false);
      setDownvoteCount(downvoteCount + 1);
    } else if (currentVote && !currentVoteValue) {
      // if there's already a vote and it's a downvote, cancel it out
      setCurrentVote(false);
      setUpvoteCount(upvoteCount - 1);
    } else {
      // if there's already a vote and it's an upvote, replace it
      setCurrentVoteValue(true);
      setUpvoteCount(upvoteCount - 1);
      setDownvoteCount(downvoteCount + 1);
    }

    try {
      await axios.post(`${BASE_URL}/reviews/vote`, {
        user_id: user_Id,
        post_id: String(preview.review_id),
        upvote: false,
      });
      // Sync downvote with review page or feed
    } catch (error) {
      console.error("Error downvoting review:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchReview = async () => {
        try {
          console.log("refetching the review statec");
          const response = await axios.get(
            `${BASE_URL}/reviews/${preview.review_id}`
          );
          if (response.data) {
            // these don't update the parent component!
            setUpvoteCount(response.data.review_stat.upvotes);
            setDownvoteCount(response.data.review_stat.downvotes);
          }
        } catch (error) {
          console.error("Error fetching review:", error);
        }
      };

      fetchReview();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchVote = async () => {
        try {
          console.log("FETCHING USER VOTE");
          const response = await axios.get(
            `${BASE_URL}/reviews/vote/${user_Id}/${preview.review_id}`
          );
          console.log(
            "request: ",
            `${BASE_URL}/reviews/vote/${user_Id}/${preview.review_id}`
          );
          console.log("response: ", response.data);
          if (response.data) {
            const { upvote } = response.data;
            console.log("upvote: ", upvote);
            setCurrentVote(true);
            setCurrentVoteValue(upvote);
          } else {
            setCurrentVote(false);
          }
        } catch (error) {
          console.error("Error fetching vote:", error);
        }
      };

      fetchVote();
    }, [])
  );

  const handleCommentPress = () => {
    console.log("comment icon pressed");
  };

  const handleViewMorePress = () => {
    setShowFullComment(!showFullComment);
  };

  const handlePreviewPress = () => {
    // Navigate to the ReviewPage when the preview is clicked
    router.push({
      pathname: "/ReviewPage",
      params: { review_id: preview.review_id, userId: user_Id },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.vinyl}>
        <Image source={MusicDisk} style={styles.musicDisk} />
        {preview.media_cover ? (
          <Image
            source={{ uri: preview.media_cover }}
            style={styles.mediaCover}
            resizeMode="cover"
          />
        ) : null}
      </View>

      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.leftSection}>
            <Image
              style={styles.profilePicture}
              source={{ uri: preview.profile_picture }}
            />
            <View style={styles.textContainer}>
              <Text style={styles.displayName}>{preview.display_name}</Text>
              <Text style={styles.username}>@{preview.username}</Text>
            </View>
          </View>
        </View>

        <View style={styles.mediaContainer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.songName}>{preview.media_title}</Text>
            <Text style={styles.artistName}>{preview.media_artist}</Text>
          </View>

          <View>
            <Image
              source={getRatingImage(
                preview.rating as keyof typeof ratingImages
              )}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={handlePreviewPress}>
        <Text style={styles.commentText}>
          {preview.comment && preview.comment.length > 100
            ? showFullComment
              ? preview.comment
              : `${preview.comment.slice(0, 100)}...`
            : preview.comment}
        </Text>
        {preview.comment && preview.comment.length > 100 && (
          <TouchableOpacity onPress={handleViewMorePress}>
            <Text style={styles.readMore}>
              {showFullComment ? "Show less" : "Read more"}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {preview.tags && preview.tags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
        >
          {preview.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.actionsContainer}>
        <View style={styles.voteContainer}>
          <TouchableOpacity onPress={handleUpvotePress}>
            <Image
              source={Upvotes}
              style={[
                styles.voteIcon,
                {
                  tintColor:
                    currentVote && currentVoteValue ? "#FFD700" : "#555",
                },
              ]}
            />
          </TouchableOpacity>
          <Text>{upvoteCount}</Text>
          <TouchableOpacity onPress={handleDownvotePress}>
            <Image
              source={Downvotes}
              style={[
                styles.voteIcon,
                {
                  tintColor:
                    currentVote && !currentVoteValue ? "#FFD700" : "#555",
                },
              ]}
            />
          </TouchableOpacity>
          <Text>{downvoteCount}</Text>
          <TouchableOpacity onPress={handleCommentPress}>
            <Image source={Comments} style={styles.voteIcon} />
          </TouchableOpacity>
          <Text>{preview.review_stat.comment_count}</Text>
        </View>
        <TouchableOpacity onPress={() => console.log("share pressed")}>
          <Image source={Share} style={styles.voteIcon} />
        </TouchableOpacity>
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
    overflow: "scroll",
  },
  vinyl: {
    position: "absolute",
    top: 0,
    right: 0,
    alignItems: "center",
  },
  musicDisk: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    borderTopRightRadius: 15,
  },
  mediaCover: {
    position: "absolute",
    width: 62,
    height: 62,
    top: -8,
    right: -3,
    borderRadius: 30,
    overflow: "hidden",
  },
  container: {
    width: "100%",
    alignItems: "flex-start",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Align left and right sections
    width: "100%",
    marginBottom: 10,
    overflow: "scroll",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
    backgroundColor: "grey",
  },
  textContainer: {
    flexDirection: "column",
  },
  displayName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  username: {
    fontSize: 13,
    color: "#888",
  },
  songName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111",
    marginTop: 5,
    width: 200,
    textAlign: "left",
  },
  artistName: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
    textAlign: "left",
  },
  ratingContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  mediaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    textAlign: "left",
    marginVertical: 8,
  },
  readMore: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
  tagsContainer: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  tag: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#C0C0C0",
  },
  tagText: {
    color: "#333",
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  vote: {
    marginHorizontal: 5,
  },
  voteIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
});

export default ReviewPreview;
