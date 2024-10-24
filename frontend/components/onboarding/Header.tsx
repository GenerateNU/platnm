import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";

interface HeaderProps {
  title: string;
  subtitle: string;
}

const OnboardingHeader: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const colorScheme = useColorScheme(); // Detect system theme

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: colorScheme === "dark" ? "#FFFFFF" : "#000000" },
        ]}
      >
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 11,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#7C7C7C",
  },
});

export default OnboardingHeader;
