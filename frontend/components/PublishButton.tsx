import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface PublishButtonProps {
  handleClick: () => void;
}

const PublishButton: React.FC<PublishButtonProps> = ({ handleClick }) => {
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
