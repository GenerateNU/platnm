import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import Back from "@/assets/images/Icons/Back.svg";
interface HeaderComponentProps {
  title: string;
  centered?: boolean;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  centered = false,
}) => {
  return (
    <SafeAreaView
      style={centered ? styles.containerCentered : styles.headerContainer}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Back />
      </TouchableOpacity>
      <View>
        <Text style={centered ? styles.headerTitleCenter : styles.headerTitle}>
          {title}
        </Text>
      </View>
      <View style={styles.spacer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "100%",
    padding: 15,
    marginTop: 56,
    gap: 24,
    alignItems: "flex-start",
  },
  containerCentered: {
    marginTop: 0,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
    height: 100,
    display: "flex",
  },
  headerTitleCenter: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#434343",
    borderRadius: 5,
    padding: 5,
    textAlign: "center",
  },
  backButton: {
    padding: 4,
    marginLeft: 20,
  },
  backText: {
    color: "#B7B6B6",
    fontSize: 16,
    marginLeft: 20,
  },
  titleContainer: {},
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#434343",
    borderRadius: 5,
    padding: 5,
    textAlign: "left",
  },
  spacer: {
    flex: 1,
  },
});

export default HeaderComponent;
