import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
  userId: string;
}

const ReviewPreview: React.FC<PreviewProps> = ({ preview, userId }) => {
  const [showFullComment, setShowFullComment] = useState(false);

  const [upVote, setupVote] = useState<Boolean>();
  const [downVote, setdownVote] = useState<Boolean>();
  const [upvoteCount, setUpvoteCount] = useState<number>(0);
  const [downvoteCount, setDownvoteCount] = useState<number>(0);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const getRatingImage = (rating: keyof typeof ratingImages) => {
    return ratingImages[rating]; // Access the image from the preloaded images object
  };

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
    console.log(preview.review_id);
    console.log(userId);
    try {
      await axios.post(`${BASE_URL}/reviews/vote`, {
        user_id: userId,
        post_id: String(preview.review_id),
        upvote: true,
      });
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
    
  };

  const handleDownvotePress = async () => {
    console.log("downvote icon pressed");
    console.log(preview.review_id);
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
      await axios.post(`${BASE_URL}/reviews/vote`, {
        user_id: userId,
        post_id: String(preview.review_id),
        upvote: false,
      });
    } catch (error) {
      console.error("Error downvoting comment:", error);
    }
  };

  const handleCommentPress = () => {
    console.log("comment icon pressed");
  };

  const handleViewMorePress = () => {
    setShowFullComment(!showFullComment);
  };

  const handlePreviewPress = () => {
    // Navigate to the ReviewPage when the preview is clicked
    // navigation.navigate("ReviewPage", { review_id: preview.review_id });
    router.push({
      pathname: "/ReviewPage",
      params: { review_id: preview.review_id, userId: userId },
    });
  };

  useEffect(() => {
    const fetchVote = async () => {
      try {
        console.log("Fetching vote");
        console.log(userId)
        console.log(preview.review_id)
        const response = await axios.get(`${BASE_URL}/reviews/vote/${userId}/${preview.review_id}`);
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
        }
      } catch (error) {
        console.error("Error fetching vote:", error);
      }
      };
      fetchVote();
    }, [preview.review_id, userId, downVote, upVote]);

  return (
    //<TouchableOpacity onPress={handlePreviewPress}> {/* Wrap the card with TouchableOpacity */}
    <View style={styles.card}>
      <View style={styles.vinyl}>
        <Image source={MusicDisk} style={styles.musicDisk} />
        {preview.media_cover ? (
          <Image
            source={{ uri: preview.media_cover }} // Use uri for remote images
            style={styles.mediaCover}
            resizeMode="cover"
          />
        ) : null}
      </View>

      <View style={styles.container}>
        {/* Top Section with Profile Picture and Name */}
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

        {/* Song Name and Artist Name */}
        <View style={styles.mediaContainer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.songName}>{preview.media_title}</Text>
            <Text style={styles.artistName}>{preview.media_artist}</Text>
          </View>

          {/* Rating Image on the right side of the song title */}
          <View>
            <Image
              source={getRatingImage(
                preview.rating as keyof typeof ratingImages,
              )}
            />
          </View>
        </View>
      </View>

      {/* Comment Section */}
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

      {/* Tags Section */}
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

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <View style={styles.voteContainer}>
          <TouchableOpacity onPress={handleUpvotePress}>
            <Image source={Upvotes} style={[
            styles.voteIcon,
            { tintColor: upVote ? "#FFD700" : "#555" }, // Highlight if upvoted
          ]} />
          </TouchableOpacity>
          <Text>{upvoteCount}</Text>
          <TouchableOpacity onPress={handleDownvotePress}>
          <Image source={Downvotes} style={[
            styles.voteIcon,
            { tintColor: downVote ? "#FFD700" : "#555" }, // Highlight if upvoted
          ]} />
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
    //</TouchableOpacity>
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
