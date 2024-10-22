import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface HeaderProps {
  title: string;
  subtitle: string;
}

const OnboardingHeader: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: "#000000",
    fontWeight: "bold",
  },
  container: {
    gap: 11,
  },
  subtitle: {
    fontSize: 18,
    color: "#7C7C7C",
  },
});

export default OnboardingHeader;
