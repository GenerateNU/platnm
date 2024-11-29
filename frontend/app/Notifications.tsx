import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/components/AuthProvider";
import HeaderComponent from "@/components/HeaderComponent";
import { StyleSheet } from "react-native";
import Notification from "@/components/notifications/Notification";
import axios from "axios";

import SkeletonLoader from "expo-skeleton-loader";

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
        // TODO: sort into old and new notifications if its older than 7 days
        const notifications = response.data.map((notification: any) => ({
          ...notification,
          read: true,
        }));
        setNotifications(notifications);
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
        {showSkeleton && (
          <SkeletonLoader
            duration={1000}
            boneColor="#f0f0f0"
            highlightColor="#fff"
          >
            <SkeletonLoader.Container>
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonLoader.Item
                  key={index}
                  style={{ width: 400, height: 50, marginBottom: 5 }}
                />
              ))}
            </SkeletonLoader.Container>
          </SkeletonLoader>
        )}
        {notifications.length > 0 &&
          notifications.map((notification, index) => {
            return <Notification key={index} notification={notification} />;
          })}
        <Text style={styles.title}>Last 7 Days</Text>
        {showSkeleton && (
          <SkeletonLoader
            duration={1000}
            boneColor="#f0f0f0"
            highlightColor="#fff"
          >
            <SkeletonLoader.Container>
              {Array.from({ length: 7 }).map((_, index) => (
                <SkeletonLoader.Item
                  key={index}
                  style={{ width: 400, height: 50, marginBottom: 5 }}
                />
              ))}
            </SkeletonLoader.Container>
          </SkeletonLoader>
        )}
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
