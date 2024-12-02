import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import HeaderComponent from "../HeaderComponent";
import Ghost from "@/assets/images/Recommendation/empty-rec.svg";

const NoRecommendations = () => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        minHeight: Dimensions.get("window").height,
      }}
    >
      <HeaderComponent title="Recommendations" />
      <View
        style={{
          marginTop: 64,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ghost />
      </View>
      <View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 24,
            textAlign: "center",
          }}
        >
          Your friends are on mute!
        </Text>
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>Guess you’re the DJ now—</Text>
          <Text style={styles.emptyText}>hope you have good taste!</Text>
        </View>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => {
            router.push("/search");
          }}
        >
          <Text style={styles.exploreText}>Explore Music</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoRecommendations;

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    fontWeight: 300,
    fontSize: 20,
  },
  emptyWrapper: {
    marginTop: 16,
  },
  exploreText: {
    color: "#475569",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  exploreButton: {
    padding: 8,
    borderRadius: 12,
    borderColor: "#D0D5DD",
    borderWidth: 1,
    width: 156,
    margin: "auto",
    marginTop: 32,
  },
});
