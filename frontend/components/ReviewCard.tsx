import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import StarRating from "react-native-star-rating-widget";
import MusicDisk from "../assets/images/music-disk.png";

interface ReviewCardProps {
  rating: number;
  review: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ rating, review }) => {
  const [profilePicture, setProfilePicture] = useState(
    require("@/assets/images/placeholder-profile.png"),
  );
  const [displayName, setDisplayName] = useState("Name");
  const [songName, setSongName] = useState("Song Name");

  const [username, setUsername] = useState("@username");

  return (
    <View style={styles.card}>
      <Image source={MusicDisk} style={styles.musicDisk} />
      <View style={styles.topLeftContainer}>
        <Image style={styles.profilePicture} source={profilePicture} />
        <View style={styles.textContainer}>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
      </View>
      <View style={styles.review}>
        <StarRating
          rating={rating}
          onChange={() => {}}
          emptyColor="#2C2C2C"
          color="#2C2C2C"
          animationConfig={{ scale: 1 }}
          starSize={20}
        />
        <Text style={styles.songName}>{songName}</Text>
        <Text style={styles.reviewText}>{review}</Text>
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
    margin: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  musicDisk: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 100,
    height: 100,
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
  reviewText: {
    fontSize: 14,
    marginTop: 5,
  },
  review: {
    padding: 5,
    flex: 1,
    alignSelf: "flex-start",
  },
});

export default ReviewCard;
