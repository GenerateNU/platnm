import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import axios from "axios";

interface ReviewCardProps {
  rating: number;
  review: string;
}

const PublishButton: React.FC<ReviewCardProps> = ({ rating, review }) => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL
  const handleClick = () => {
    console.log("Publishing review");
    axios
      .post(`${BASE_URL}/reviews`, {
        user_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        media_type: "track",
        media_id: 2,
        comment: review,
        rating: parseInt(rating.toString()),
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <View style={styles.row}>
          <Text style={styles.text}>Publish</Text>
          <Icon name="arrow-up" size={24} color="#FFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 5,
    paddingLeft: 50,
    paddingRight: 50,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#FFF",
    marginLeft: 5,
  },
});

export default PublishButton;
