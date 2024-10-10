import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "expo-router";

interface NextButtonProps {
  completed: boolean;
  rating: number;
  review: string;
}

const NextButton: React.FC<NextButtonProps> = ({
  completed,
  rating,
  review,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: completed ? "#000" : "#D9D9D9" },
        ]}
        onPress={() => {
          if (completed) {
            navigation.navigate("PreviewReview", {
              rating: rating,
              review: review,
            });
          }
        }}
        disabled={!completed}
      >
        <View style={styles.row}>
          <Text style={styles.text}>Next</Text>
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

export default NextButton;
