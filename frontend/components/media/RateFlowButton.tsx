import React, { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type RateFlowButtonProps = {
  text: string;
  primary?: boolean;
  iconName?: string;
  handleClick: () => void;
};

const RateFlowButton = ({
  text,
  primary = true,
  iconName,
  handleClick,
}: RateFlowButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: primary ? "#F28037" : "#434343",
      }}
      onPress={handleClick}
    >
      <View style={styles.row}>
        <Text style={styles.text}>{text}</Text>
        {iconName && <Icon name={iconName} size={24} color="#FFF" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#434343",
    borderRadius: 5,
    paddingHorizontal: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  text: {
    color: "#FFF",
    marginLeft: 5,
    fontWeight: 700,
  },
});

export default RateFlowButton;
