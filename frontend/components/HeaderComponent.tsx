import React from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";

interface HeaderComponentProps {
  title: string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
  },
  backText: {
    color: "#B7B6B6",
    fontSize: 16,
    marginLeft: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#434343",
    fontFamily: "Roboto",
    borderRadius: 5,
    padding: 5,
    marginLeft: "14%",
  },
});

export default HeaderComponent;
