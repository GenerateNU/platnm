import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/components/AuthProvider";
import HeaderComponent from "@/components/HeaderComponent";
import { StyleSheet } from "react-native";
import Notification from "@/components/notifications/Notification";
import axios from "axios";
import NotificationSkeleton from "@/components/notifications/NotificationSkeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";

enum NotificationType {
  Follow = "follow",
  Comment = "comment",
  Upvote = "upvote",
}

const Notifications = () => {
  // const { userId } = useAuthContext();
  const userId = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // Hardcoding - Get userId from navigation
  const [notifications, setNotifications] = useState<CustomNotification[]>([]);
  const [oldNotifications, setOldNotifications] = useState<
    CustomNotification[]
  >([]);
  // two states feels very clunky - maybe we can refactor this
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BASE_URL}/users/notifications/${userId}`,
        );
        console.log(response.status);
        // TODO: sort into old and new notifications if its older than 7 days
        const notifications = response.data.map((notification: any) => ({
          ...notification,
          read: true,
        }));

        const oldNotifications: CustomNotification[] = [];
        const newNotifications: CustomNotification[] = [];
        response.data.forEach(async (notification: any) => {
          // filter example thumbnails with a placeholder
          if (notification.thumbnail.indexOf("https://example.com/") > -1) {
            notification.thumbnail =
              "https://avatars.githubusercontent.com/u/59008111?s=40&v=4";
          }
          // check if older than 7 days
          const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
          if (
            new Date(notification.created_at) <
            new Date(Date.now() - SEVEN_DAYS)
          ) {
            oldNotifications.push(notification);
          } else {
            newNotifications.push(notification);
          }
          // check if read
          notification.read =
            (await AsyncStorage.getItem("notification:" + notification.id)) ===
            "true";
          if (!notification.read) {
            await AsyncStorage.setItem(
              "notification:" + notification.id,
              "true",
            );
          }
        });

        setNotifications(newNotifications);
        setOldNotifications(oldNotifications);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    if (!loading) {
      setShowSkeleton(false);
    }
  }, [notifications]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderComponent title="Your Notifications" />
      </View>
      <ScrollView style={styles.bodyContainer}>
        <Text style={styles.title}>Recent</Text>
        {showSkeleton && <NotificationSkeleton count={4} />}
        {notifications.map((notification, index) => {
          return <Notification key={index} notification={notification} />;
        })}
        <Text style={styles.title}>Last 7 Days</Text>
        {showSkeleton && <NotificationSkeleton count={7} />}
        {oldNotifications.map((notification, index) => {
          return <Notification key={index} notification={notification} />;
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bodyContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
});

export default Notifications;
