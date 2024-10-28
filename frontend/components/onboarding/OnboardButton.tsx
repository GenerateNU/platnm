import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  GestureResponderEvent,
} from "react-native";

// Define props for the CustomButton
interface CustomButtonProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: object;
  backgroundColor?: string;
  svgIcon?: JSX.Element;
}

const OnboardButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  style,
  backgroundColor,
  svgIcon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: backgroundColor }]}
    >
      {svgIcon ? <View style={styles.icon}>{svgIcon}</View> : null}
      <Text style={[styles.buttonText]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    textAlign: "center",
    backgroundColor: "#000000",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  icon: {
    marginRight: 10,
  },
});

export default OnboardButton;
