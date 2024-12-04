import HeaderComponent from "@/components/HeaderComponent";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
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
  KeyboardAvoidingView,
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
import Downvote from "@/assets/images/ReviewPreview/downvote.svg";
import Upvote from "@/assets/images/ReviewPreview/upvote.svg";
import Comment from "@/assets/images/ReviewPreview/comment.svg";
import Share from "@/assets/images/ReviewPreview/share.svg";
import Upload from "@/assets/images/Icons/Upload.svg";
import { useAuthContext } from "@/components/AuthProvider";

interface ReviewPageProps {
  route: {
    params: {
      review_id: string;
    };
  };
}

const ReviewPage: React.FC<ReviewPageProps> = ({ route }) => {
  const { review_id } = useLocalSearchParams<{
    review_id: string;
  }>();
  const [review, setReview] = useState<Preview>();
  const [comments, setComments] = useState<Comment[]>();
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { userId } = useAuthContext();
  const MusicDisk = require("../assets/images/music-disk.png");

  const [currentVote, setCurrentVote] = useState<boolean>(false); // does a vote currently exist?
  const [currentVoteValue, setCurrentVoteValue] = useState<boolean>(false); // what is the current vote's value?

  const [upvoteCount, setUpvoteCount] = useState<number>(0);
  const [downvoteCount, setDownvoteCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");

  const [isEditable, setIsEditable] = useState(false);
  const [editedComment, setEditedComment] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);

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

  const [sharePopupVisible, setSharePopupVisible] = useState(false);

  const handleSharePress = () => {
    setSharePopupVisible(true); // Show the share popup
  };

  const closeSharePopup = () => {
    setSharePopupVisible(false); // Close the share popup
  };

  const getRatingImage = (rating: keyof typeof ratingImages) => {
    return ratingImages[rating]; // Access the image from the preloaded images object
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
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    const fetchComments = async () => {
      console.log("fetchReviews");
      console.log("review_id", review_id);
      try {
        const response = await axios.get(
          `${BASE_URL}/reviews/comments/${review_id}`,
        );
        console.log("response", response.data);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchReview();
    fetchComments();
  }, []);

  const handleUserPress = () => {
    // Navigate to the UserPage when the user is clicked
    const pathName =
      review?.user_id === userId ? "/(tabs)/profile" : "/(tabs)/user";
    router.push({
      pathname: pathName,
      params: {
        userId: review?.user_id,
      },
    });
  };

  const handleMediaPress = () => {
    // Navigate to the MediaPage
    console.log("Media pressed");
    router.push({
      pathname: "/MediaPage",
      params: { mediaId: review?.media_id, mediaType: review?.media_type },
    });
  };

  return review ? (
    <View style={styles.container}>
      <HeaderComponent title="Review" />
      <ScrollView style={styles.container}>
        <View style={styles.reviewContainer}>
          <View style={styles.topSection}>
            <View style={styles.topContainer}>
              <View style={styles.leftSection}>
                <TouchableOpacity onPress={handleUserPress}>
                  <Image
                    style={styles.profilePicture}
                    source={{ uri: review.profile_picture }}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.displayName}>
                      {review.display_name}
                    </Text>
                    <Text style={styles.username}>@{review.username}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={handleMediaPress} style={styles.vinyl}>
              <View style={styles.vinyl}>
                <Image source={MusicDisk} style={styles.musicDisk} />
                {review.media_cover && (
                  <Image
                    source={{ uri: review.media_cover }} // Use uri for remote images
                    style={styles.mediaCover}
                    resizeMode="cover"
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.mediaContainer}>
            <TouchableOpacity onPress={handleMediaPress}>
              <View style={styles.ratingContainer}>
                <Text
                  style={styles.songName}
                  numberOfLines={2} // Limits to 2 lines, change as needed
                  ellipsizeMode="tail" // Adds ellipsis (...) if the text overflows
                >
                  {review.media_title}
                </Text>
                <Text style={styles.artistName}>{review.media_artist}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.rating}>
            {React.createElement(
              getRatingImage(review.rating as keyof typeof ratingImages),
              {
                width: 150, // Adjust size as needed
                height: 150,
              },
              {
                style: styles.ratingImage,
              } as any,
            )}
          </View>
          <Modal visible={showPopup} transparent>
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setShowPopup(false)}
              activeOpacity={1} // Prevent the modal itself from closing on tap
            >
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
            </TouchableOpacity>
          </Modal>
          <Modal visible={sharePopupVisible} transparent animationType="slide">
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={closeSharePopup}
              activeOpacity={1} // Prevent modal from closing when clicking on content
            >
              <View style={styles.sharePopupContainer}>
                <Text style={styles.sharePopupTitle}>Share This Review</Text>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => console.log("Share to Friends Pressed")}
                >
                  <Text style={styles.shareButtonText}>Share to Friends</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
            <View style={styles.tagsContainer}>
              {review.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <View style={styles.voteContainer}>
              <TouchableOpacity
                onPress={() => handleVotePress(true)}
                style={styles.voteButton}
              >
                <Upvote
                  width={24}
                  height={24}
                  fill={currentVote && currentVoteValue ? "#F28037" : "#555"}
                  style={{
                    color: currentVote && currentVoteValue ? "#F28037" : "#555",
                  }}
                />
                <Text>{upvoteCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleVotePress(false)}
                style={styles.voteButton}
              >
                <Downvote
                  width={24}
                  height={24}
                  fill={currentVote && !currentVoteValue ? "#F28037" : "#555"}
                  style={{
                    color:
                      currentVote && !currentVoteValue ? "#F28037" : "#555",
                  }}
                />
                <Text>{downvoteCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCommentPress}
                style={styles.voteButton}
              >
                <Comment width={24} height={24} />
              </TouchableOpacity>
              <Text>{review.review_stat.comment_count}</Text>
              <TouchableOpacity onPress={handleSharePress}>
                <View style={{ marginLeft: 7 }}>
                  <Share width={24} height={24} />
                </View>
              </TouchableOpacity>
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
          <View style={styles.comments}>
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => {
                return (
                  //<Comment key={index} comment={comment} />
                  null
                );
              })
            ) : (
              <Text style={styles.noReviewsText}>No comments found.</Text>
            )}
            <View style={{ paddingVertical: 40 }} />
          </View>
        </View>
      </ScrollView>
      {/* Fixed TextBox for Comment */}
      <KeyboardAvoidingView
        style={styles.commentBoxContainer}
        keyboardVerticalOffset={32}
        behavior="padding"
        enabled
      >
        <TextInput
          style={styles.commentInput}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          multiline
        ></TextInput>
        <TouchableOpacity style={{}} onPress={handleCommentSubmit}>
          <Upload
            width={16}
            height={16}
            style={{ marginLeft: 10, marginRight: 10 }}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    padding: 20,
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
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
  ratingImageWrapper: {
    width: "100%",
    height: 100,
    overflow: "hidden", // This ensures cropping of the image
    alignItems: "center",
  },
  ratingContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  mediaContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "95%",
    height: "15%",
    marginTop: 20,
  },
  songName: {
    fontSize: 20, // Adjust size as needed
    fontWeight: "bold",
    color: "#000", // Adjust color as needed
    flexWrap: "wrap",
    width: "95%",
  },
  artistName: {
    fontSize: 18,
    color: "#888",
  },
  comment: {
    fontSize: 16,
    marginVertical: 10,
  },
  rating: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: -20,
    paddingRight: 20, // Add this to account for the left padding of reviewContainer
  },

  ratingImage: {
    alignSelf: "center", // Add this
  },

  tagsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    paddingVertical: 15,
    minHeight: 60, // Change from fixed height to minHeight
    flexWrap: "wrap", // Allows wrapping to a new line
    gap: 8, // Space between tags
  },

  tag: {
    backgroundColor: "rgba(242, 128, 55, 0.65)",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#C0C0C0",
    minHeight: 25, // Change from height to minHeight
    justifyContent: "center", // Add this
  },

  tagText: {
    color: "#333",
    fontSize: 12,
    lineHeight: 16, // Add this to ensure proper text spacing
    textAlignVertical: "center", // Add this
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
    bottom: 50,
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
    flexDirection: "row",
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#EFF1F5",
  },
  submitButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  noReviewsText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
  sharePopupContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  sharePopupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ReviewPage;
