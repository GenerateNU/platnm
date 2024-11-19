import HeaderComponent from "@/components/HeaderComponent";
import CommentComponent from "@/components/CommentComponent";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

interface ReviewPageProps {
  route: {
    params: {
      review_id: string;
      user_id: string;
    };
  };
}

const ReviewPage: React.FC<ReviewPageProps> = ({ route }) => {
  const { review_id, user_id } = useLocalSearchParams<{
    review_id: string;
    user_id: string;
  }>();
  const [review, setReview] = useState<Preview>();
  const [comments, setComments] = useState<UserComment[]>();
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const userId = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // Hardcoding - Get userId from navigation
  const Comments = require("../assets/images/ReviewPreview/comments.png");
  const Upvotes = require("../assets/images/ReviewPreview/upvote.png");
  const Downvotes = require("../assets/images/ReviewPreview/downvote.png");
  const Share = require("../assets/images/ReviewPreview/share.png");
  const MusicDisk = require("../assets/images/music-disk.png");

  const [upVote, setupVote] = useState<Boolean>();
  const [downVote, setdownVote] = useState<Boolean>();
  const [upvoteCount, setUpvoteCount] = useState<number>(0);
  const [downvoteCount, setDownvoteCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");

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
    try {
      await axios.post(`${BASE_URL}/reviews/vote`, {
        user_id: userId,
        post_id: review_id,
        upvote: true,
      });
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  const handleDownvotePress = async () => {
    console.log("downvote icon pressed");
    console.log(review_id);
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
        post_id: review_id,
        upvote: false,
      });
    } catch (error) {
      console.error("Error downvoting comment:", error);
    }
  };

  const handleCommentPress = () => {
    console.log("comment icon pressed");
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // Do not submit if the comment is empty
    setCommentCount(commentCount + 1);

    try {
      await axios.post(
        `${BASE_URL}/reviews/comment`,
        {
          user_id: userId,
          review_id: parseInt(review_id, 10),
          text: newComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setNewComment(""); // Clear the input after submitting
      // Fetch updated comments after submitting
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Fetch the review data using the review_id
  useEffect(() => {
    const fetchReview = async () => {
      console.log("fetchReviews");

      console.log("review_id", review_id);

      try {
        const response = await axios.get(`${BASE_URL}/reviews/${review_id}`);
        console.log("response", response.data);
        setReview(response.data);
        if (review) {
          setUpvoteCount(review.review_stat.upvotes);
          setDownvoteCount(review.review_stat.downvotes);
          setCommentCount(review.review_stat.comment_count);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
    fetchComments();
  }, [review_id, userId, user_id]);

  const fetchComments = async () => {
    console.log("fetchComments");
    console.log("review_id", review_id);
    try {
      const response = await axios.get(
        `${BASE_URL}/reviews/comments/${review_id}`,
      );
      console.log("comments", response.data);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchVote = async () => {
      try {
        console.log("Fetching vote");
        console.log(userId);
        console.log(review_id);
        const response = await axios.get(
          `${BASE_URL}/reviews/vote/${userId}/${review_id}`,
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
        }
      } catch (error) {
        console.error("Error fetching vote:", error);
      }
    };
    fetchVote();
  }, [review_id, userId, downVote, upVote]);

  return review ? (
    <View style={styles.container}>
      <HeaderComponent title="Review" />
      <ScrollView style={styles.container}>
        <View style={styles.reviewContainer}>
          <View style={styles.topSection}>
            <View style={styles.topContainer}>
              <View style={styles.leftSection}>
                <Image
                  style={styles.profilePicture}
                  source={{ uri: review.profile_picture }}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.displayName}>{review.display_name}</Text>
                  <Text style={styles.username}>@{review.username}</Text>
                </View>
              </View>
            </View>
            <View style={styles.vinyl}>
              <Image source={MusicDisk} style={styles.musicDisk} />
              {review.media_cover ? (
                <Image
                  source={{ uri: review.media_cover }} // Use uri for remote images
                  style={styles.mediaCover}
                  resizeMode="cover"
                />
              ) : null}
            </View>
          </View>
          <Text style={styles.songName}>{review.media_title}</Text>
          <Text style={styles.artistName}>{review.media_artist}</Text>
          {/* Rating Image on the right side of the song title */}
          <View>
            <Image
              source={getRatingImage(
                review.rating as keyof typeof ratingImages,
              )}
              style={styles.ratingImage}
            />
          </View>

          <Text style={styles.comment}>{review.comment}</Text>
          {/* Tags Section */}
          {review.tags && review.tags.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tagsContainer}
            >
              {review.tags.map((tag, index) => (
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
                <Image
                  source={Upvotes}
                  style={[
                    styles.voteIcon,
                    { tintColor: upVote ? "#FFD700" : "#555" }, // Highlight if upvoted
                  ]}
                />
              </TouchableOpacity>
              <Text>{upvoteCount}</Text>
              <TouchableOpacity onPress={handleDownvotePress}>
                <Image
                  source={Downvotes}
                  style={[
                    styles.voteIcon,
                    { tintColor: downVote ? "#FFD700" : "#555" }, // Highlight if upvoted
                  ]}
                />
              </TouchableOpacity>
              <Text>{downvoteCount}</Text>
              <TouchableOpacity onPress={handleCommentPress}>
                <Image source={Comments} style={styles.voteIcon} />
              </TouchableOpacity>
              <Text>{review.review_stat.comment_count}</Text>
            </View>
            <TouchableOpacity onPress={() => console.log("share pressed")}>
              <Image source={Share} style={styles.voteIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.comments}>
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => {
                return <CommentComponent key={index} comment={comment} />;
              })
            ) : (
              <Text style={styles.noReviewsText}>No comments found.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Fixed TextBox for Comment */}
      <View style={styles.commentBoxContainer}>
        <TextInput
          style={styles.commentInput}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          multiline
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCommentSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  reviewContainer: {
    alignItems: "center",
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  songName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  artistName: {
    fontSize: 18,
    color: "#888",
  },
  comment: {
    fontSize: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingImage: {
    width: 150,
    height: 150,
    marginVertical: 20,
  },
  noReviewsText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
  comments: {
    width: "100%",
    marginTop: 20,
    marginBottom: 50,
  },
  tagsContainer: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  tag: {
    backgroundColor: "#FDE1D5",
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
    width: 100,
    height: 100,
  },
  mediaCover: {
    position: "absolute",
    width: 80,
    height: 80,
    top: -12,
    right: -5,
    borderRadius: 40,
    overflow: "hidden",
  },
  topSection: {
    position: "relative",
    width: "100%",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Align left and right sections
    width: "100%",
    marginBottom: 10,
    marginLeft: 10,
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
  commentBoxContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "#D3D3D3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  submitButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
});

export default ReviewPage;
