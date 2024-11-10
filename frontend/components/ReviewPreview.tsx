// import React, { useState } from "react";
// import { View, Text, StyleSheet, Image } from "react-native";
// import { IconButton } from "react-native-paper";
// import StarRating from "react-native-star-rating-widget";
// import UpvoteIcon from "@/assets/images/upvote.svg";
// import DownvoteIcon from "@/assets/images/downvote.svg";
// const MusicDisk = require("../assets/images/music-disk.png");


// interface PreviewProps {
//   preview: Preview
// }

// const ReviewPreview: React.FC<PreviewProps> = ({ preview }) => {
//   const handleUpvotePress = () => {
//     console.log("upvote icon pressed");
//     // Add share icon press handling logic here
//   };

//   const handleDownvotePress = () => {
//     console.log("downvote icon pressed");
//     // Add edit icon press handling logic here
//   };

//   const handleCommentPress = () => {
//     console.log("comment icon pressed");
//     // Add share icon press handling logic here
//   };

//   const handleViewMorePress = () => {
//     console.log("view more pressed");
//     // Add edit icon press handling logic here
//   };
  
//   return (
//     <View style={styles.card}>
//       <Image source={MusicDisk} style={styles.musicDisk} />
//       <View style={styles.topLeftContainer}>
//         <Image style={styles.profilePicture} source={{ uri: preview.profile_picture }} />
//         <View style={styles.textContainer}>
//           <Text style={styles.displayName}>{preview.display_name}</Text>
//           <Text style={styles.username}>{preview.username}</Text>
//         </View>
//       </View>
//       <View style={styles.review}>
//         <StarRating
//           rating={preview.rating}
//           onChange={() => {}}
//           emptyColor="#2C2C2C"
//           color="#2C2C2C"
//           animationConfig={{ scale: 1 }}
//           starSize={20}
//         />
//         <Text style={styles.commentText}>{preview.comment}</Text>
//         <View style={styles.voteContainer}>
//           <IconButton
//             style={styles.vote}
//             onPress={handleUpvotePress}
//             icon={UpvoteIcon}
//           />
//           <Text>{4}</Text>
//           <IconButton
//             style={styles.vote}
//             onPress={handleDownvotePress}
//             icon={DownvoteIcon}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: "column",
//     backgroundColor: "#C4C4C4",
//     padding: 10,
//     flex: 1,
//     marginVertical: 20,
//     alignItems: "center",
//     borderRadius: 15,
//   },
//   musicDisk: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     width: 100,
//     height: 100,
//     borderRadius: 15,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   topLeftContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//   },
//   profilePicture: {
//     width: 40,
//     height: 40,
//     borderRadius: 25,
//     marginRight: 10,
//     backgroundColor: "transparent",
//   },
//   displayName: {
//     fontWeight: "bold",
//     fontSize: 18,
//   },
//   username: {
//     fontSize: 14,
//     color: "#808080",
//   },
//   songName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   commentText: {
//     fontSize: 14,
//     marginTop: 5,
//     height: "auto",
//   },
//   review: {
//     padding: 5,
//     alignSelf: "flex-start",
//   },
//   vote: {
//     margin: 0,
//   },
//   voteContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
// });

// export default ReviewPreview;

import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import UpvoteIcon from "@/assets/images/upvote.svg";
import DownvoteIcon from "@/assets/images/downvote.svg";
const MusicDisk = require("../assets/images/music-disk.png");

interface PreviewProps {
  preview: Preview;
}

const ReviewPreview: React.FC<PreviewProps> = ({ preview }) => {
  const [showFullComment, setShowFullComment] = useState(false);

  const handleUpvotePress = () => {
    console.log("upvote icon pressed");
  };

  const handleDownvotePress = () => {
    console.log("downvote icon pressed");
  };

  const handleCommentPress = () => {
    console.log("comment icon pressed");
  };

  const handleViewMorePress = () => {
    setShowFullComment(!showFullComment);
  };

  return (
    <View style={styles.card}>
      <Image source={MusicDisk} style={styles.musicDisk} />
      <View style={styles.topLeftContainer}>
        <Image style={styles.profilePicture} source={{ uri: preview.profile_picture }} />
        <View style={styles.textContainer}>
          <Text style={styles.displayName}>{preview.display_name}</Text>
          <Text style={styles.username}>@{preview.username}</Text>
        </View>
      </View>
      <Text style={styles.songName}>{preview.media_title}</Text>
      <Text style={styles.artistName}>{preview.media_artist}</Text>
      <View style={styles.ratingContainer}>
        <StarRating
          rating={preview.rating}
          onChange={() => {}}
          emptyColor="#2C2C2C"
          color="#2C2C2C"
          animationConfig={{ scale: 1 }}
          starSize={20}
        />
      </View>
      <Text style={styles.commentText}>
        {showFullComment ? preview.comment ?? '' : `${(preview.comment ?? '').slice(0, 100)}...`}
      </Text>
      <TouchableOpacity onPress={handleViewMorePress}>
        <Text style={styles.readMore}>{showFullComment ? "Show less" : "Read more"}</Text>
      </TouchableOpacity>
      {/* Render tags section only if tags are defined and not empty */}
      {preview.tags && preview.tags.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
          {preview.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      )}
      <View style={styles.actionsContainer}>
        <View style={styles.voteContainer}>
          <IconButton style={styles.vote} onPress={handleUpvotePress} icon={UpvoteIcon} />
          <Text>{preview.review_stat.upvotes}</Text>
          <IconButton style={styles.vote} onPress={handleDownvotePress} icon={DownvoteIcon} />
        </View>
        <TouchableOpacity onPress={handleCommentPress}>
          <Text>{preview.review_stat.commentCount} 💬</Text>
        </TouchableOpacity>
        <IconButton onPress={() => console.log("share pressed")} icon="share" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#C4C4C4",
    padding: 10,
    marginVertical: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: "center",
  },
  musicDisk: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 80,
    height: 80,
  },
  topLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "grey",
  },
  textContainer: {
    flexDirection: "column",
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
  artistName: {
    fontSize: 14,
    color: "#808080",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  commentText: {
    fontSize: 14,
    marginTop: 5,
  },
  readMore: {
    fontSize: 14,
    color: "#808080",
    marginTop: 5,
    textDecorationLine: "underline",
  },
  tagsContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  tag: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  tagText: {
    color: "#000",
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  vote: {
    marginHorizontal: 5,
  },
});

export default ReviewPreview;
