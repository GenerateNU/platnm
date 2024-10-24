import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  GestureResponderEvent,
  useColorScheme,
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
  const colorScheme = useColorScheme();

  const buttonStyle = [
    styles.button,
    {
      backgroundColor:
        backgroundColor || (colorScheme === "dark" ? "#333333" : "#FFFFFF"),
    },
    style,
  ];

  const textColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      {svgIcon ? <View style={styles.icon}>{svgIcon}</View> : null}
      <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
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
  },
  buttonText: {
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
});

export default OnboardButton;
