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
  Modal,
} from "react-native";
import Rating0 from "@/assets/images/Ratings/Radial-0.svg";
import Rating1 from "@/assets/images/Ratings/Radial-1.svg";
import Rating2 from "@/assets/images/Ratings/Radial-2.svg";
import Rating3 from "@/assets/images/Ratings/Radial-3.svg";
import Rating4 from "@/assets/images/Ratings/Radial-4.svg";
import Rating5 from "@/assets/images/Ratings/Radial-5.svg";
import Rating6 from "@/assets/images/Ratings/Radial-6.svg";
import Rating7 from "@/assets/images/Ratings/Radial-7.svg";
import Rating8 from "@/assets/images/Ratings/Radial-8.svg";
import Rating9 from "@/assets/images/Ratings/Radial-9.svg";
import Rating10 from "@/assets/images/Ratings/Radial-10.svg";
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

  const [currentVote, setCurrentVote] = useState<boolean>(false); // does a vote currently exist?
  const [currentVoteValue, setCurrentVoteValue] = useState<boolean>(false); // what is the current vote's value?

  const [upvoteCount, setUpvoteCount] = useState<number>(0);
  const [downvoteCount, setDownvoteCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");

  const [isEditable, setIsEditable] = useState(false);
  const [editedComment, setEditedComment] = useState<string>("");
  const [showMenu, setShowMenu] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const ratingImages = {
    0: Rating0,
    1: Rating1,
    2: Rating2,
    3: Rating3,
    4: Rating4,
    5: Rating5,
    6: Rating6,
    7: Rating7,
    8: Rating8,
    9: Rating9,
    10: Rating10,
  };

  const getRatingImage = (rating: keyof typeof ratingImages) => {
    return ratingImages[rating]; // Access the image from the preloaded images object
  };

  const handleVotePress = async (newVoteValue: boolean) => {
    console.log("Vote icon pressed with value: ", newVoteValue);
    console.log(review_id);

    if (currentVote) {
      // if there is already a vote value, we have to delete or swap it
      if (currentVoteValue && newVoteValue) {
        // if there is an upvote and the user clicks upvote again
        setCurrentVote(false); // cancel out the vote
        setUpvoteCount(upvoteCount - 1);
      } else if (!currentVoteValue && !newVoteValue) {
        // if there is a downvote and the user clicks downvote again
        setCurrentVote(false); // cancel out the vote
        setDownvoteCount(downvoteCount - 1);
      } else if (currentVoteValue && !newVoteValue) {
        // if there is an upvote and the user clicks downvote
        setCurrentVoteValue(false);
        setUpvoteCount(upvoteCount - 1);
        setDownvoteCount(downvoteCount + 1);
      } else if (!currentVoteValue && newVoteValue) {
        // if there is a downvote and the user clicks upvote
        setCurrentVoteValue(true);
        setUpvoteCount(upvoteCount + 1);
        setDownvoteCount(downvoteCount - 1);
      }
    } else {
      setCurrentVote(true);
      setCurrentVoteValue(newVoteValue);
      if (newVoteValue) {
        setUpvoteCount(upvoteCount + 1);
      } else {
        setDownvoteCount(downvoteCount + 1);
      }
    }

    try {
      await axios.post(`${BASE_URL}/reviews/vote`, {
        user_id: userId,
        post_id: review_id,
        upvote: newVoteValue,
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
        }
      );
      setNewComment(""); // Clear the input after submitting
      // Fetch updated comments after submitting
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      const requestBody = {
        id: review_id,
        user_id: userId, // User ID to validate ownership
        comment: editedComment, // The updated comment
      };

      await axios.patch(`${BASE_URL}/reviews/${review_id}`, requestBody);
      setIsEditable(false);
      setReview((prev) => (prev ? { ...prev, comment: editedComment } : prev));
    } catch (error) {
      console.error("Error saving edited review:", error);
    }
  };

  const handleMenuOption = (option: string) => {
    setShowPopup(false);
    if (option === "edit") {
      setIsEditable(true);
      setEditedComment(review?.comment || "");
    } else if (option === "delete") {
      // Add delete functionality
    } else if (option === "manageComments") {
      // Add manage comments functionality
    } else if (option === "share") {
      // Add share functionality
    }
  };

  // Fetch the review data using the review_id
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/reviews/${review_id}`);
        const review = response.data;
        setReview(review);
        if (review) {
          // these don't update the parent component!
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
  }, [review_id, userId, user_id, newComment]);

  const fetchComments = async () => {
    console.log("fetchComments");
    console.log("review_id", review_id);
    try {
      const response = await axios.get(
        `${BASE_URL}/reviews/comments/${review_id}`
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
        if (review) {
          setUpvoteCount(review.review_stat.upvotes);
          setDownvoteCount(review.review_stat.downvotes);
          setCommentCount(review.review_stat.comment_count);
        }
        const response = await axios.get(
          `${BASE_URL}/reviews/vote/${userId}/${review_id}`
        );
        console.log(response.data);
        if (response.data) {
          setCurrentVote(true);
          const { upvote } = response.data; // Assuming the API returns { user_id, post_id, upvote }
          setCurrentVoteValue(upvote);
        } else {
          setCurrentVote(false);
        }
      } catch (error) {
        console.error("Error fetching vote:", error);
      }
    };
    fetchVote();
  }, [review_id, userId, newComment]);

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
                {review.user_id === userId && (
                  <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setShowPopup(true)}
                  >
                    <Text style={styles.menuText}>⋮</Text>
                  </TouchableOpacity>
                )}
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
            {React.createElement(
              getRatingImage(review.rating as keyof typeof ratingImages)
            )}
          </View>

          <Modal visible={showPopup} transparent>
            <View style={styles.popupContainer}>
              <TouchableOpacity
                style={styles.popupOption}
                onPress={() => handleMenuOption("edit")}
              >
                <Text>Edit Review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popupOption}
                onPress={() => handleMenuOption("manageComments")}
              >
                <Text>Manage Comments</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popupOption}
                onPress={() => handleMenuOption("share")}
              >
                <Text>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popupOption}
                onPress={() => handleMenuOption("delete")}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {isEditable ? (
            <View>
              <TextInput
                style={styles.editInput}
                value={editedComment}
                onChangeText={setEditedComment}
                multiline
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleEditSave}
              >
                <Text>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>{review.comment}</Text>
          )}
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
              <TouchableOpacity onPress={() => handleVotePress(true)}>
                <Image
                  source={Upvotes}
                  style={[
                    styles.voteIcon,
                    {
                      tintColor:
                        currentVote && currentVoteValue ? "#FFD700" : "#555",
                    }, // Highlight if upvoted
                  ]}
                />
              </TouchableOpacity>
              <Text>{upvoteCount}</Text>
              <TouchableOpacity onPress={() => handleVotePress(false)}>
                <Image
                  source={Downvotes}
                  style={[
                    styles.voteIcon,
                    {
                      tintColor:
                        currentVote && !currentVoteValue ? "#FFD700" : "#555",
                    }, // Highlight if upvoted
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
    overflow: "scroll",
  },
  ratingImageWrapper: {
    width: 100, // Set width as per requirement (in pixels or percentage)
    height: 100, // Set height as per requirement
    overflow: "hidden", // This ensures cropping of the image
    borderRadius: 50, // Optional: If you want a circular crop, use borderRadius
  },
  ratingSvg: {
    width: "100%", // Ensure SVG scales correctly inside the wrapper
    height: "100%", // Ensure SVG scales correctly inside the wrapper
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
    backgroundColor: 'rgba(242, 128, 55, 0.65)', 
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
  menuButton: { padding: 10 },
  menuText: { fontSize: 24 },
  popupContainer: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
  },
  popupOption: { padding: 10 },
  editInput: { borderColor: "#ddd", borderWidth: 1, margin: 10, padding: 10 },
  saveButton: { backgroundColor: "#007bff", padding: 10 },
});

export default ReviewPage;
