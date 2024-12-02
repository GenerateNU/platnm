import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuthContext } from "@/components/AuthProvider";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

function Settings() {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [recommendations, setRecommendations] = useState(false);
  const [reviewInteractions, setReviewInteractions] = useState(true);
  const [hideActivity, setHideActivity] = useState(false);
  const { accessToken, ...AuthContextUtils } = useAuthContext();

  async function handleSignOut() {
    axios
      .post(
        `${BASE_URL}/auth/platnm/signout`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      .then(() => {
        AuthContextUtils.updateUsername("");
        AuthContextUtils.updateSession("");
        AuthContextUtils.updateAccessToken("");
        AuthContextUtils.updateUserId("");
        router.push("/(tabs)/login");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert("You are already signed out!");
          router.push("/(tabs)/login");
        } else {
          console.log(error);
        }
      });
  }

  async function handleDeactivate() {
    axios.post(`${BASE_URL}/auth/platnm/deactivate`).then((response) => {
      console.log(response.data);
      router.push("/(tabs)/login");
    });
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backContainer}
        >
          <Icon name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Settings</Text>
        </View>
      </SafeAreaView>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Profile</Text>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Music Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push("/reset")}
        >
          <Text style={styles.itemText}>Reset Password</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Notification Settings</Text>
        <View style={styles.item}>
          <Text style={styles.itemText}>Push Notifications</Text>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: "#ddd", true: "#F28037" }}
            thumbColor={pushNotifications ? "#FFFFFF" : "#f4f3f4"}
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>Recommendations</Text>
          <Switch
            value={recommendations}
            onValueChange={setRecommendations}
            trackColor={{ false: "#ddd", true: "#F28037" }}
            thumbColor={recommendations ? "#FFFFFF" : "#f4f3f4"}
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>Review Interactions</Text>
          <Switch
            value={reviewInteractions}
            onValueChange={setReviewInteractions}
            trackColor={{ false: "#ddd", true: "#F28037" }}
            thumbColor={reviewInteractions ? "#FFFFFF" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Privacy & Social */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Privacy & Social</Text>
        <View style={styles.item}>
          <Text style={styles.itemText}>Hide Activity</Text>
          <Switch
            value={hideActivity}
            onValueChange={setHideActivity}
            trackColor={{ false: "#ddd", true: "#F28037" }}
            thumbColor={hideActivity ? "#FFFFFF" : "#f4f3f4"}
          />
        </View>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Blocked Accounts</Text>
        </TouchableOpacity>
      </View>

      {/* Languages */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Languages</Text>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Change Language</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>About</Text>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Terms of Use</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Support</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Deactivate Account Link */}
      <TouchableOpacity
        style={styles.deactivateAccount}
        onPress={handleDeactivate}
      >
        <Text style={styles.deactivateText}>Deactivate Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row", // Reverses the row direction to place back button on the right
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center", // Center horizontally
    left: -30,
  },
  backContainer: {
    paddingRight: 15,
    color: "#B7B6B6",
    fontSize: 16,
    marginLeft: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    padding: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: "#F28037",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 20,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  deactivateAccount: {
    alignItems: "center",
    paddingVertical: 20,
  },
  deactivateText: {
    color: "#888",
    fontSize: 14,
  },
});
