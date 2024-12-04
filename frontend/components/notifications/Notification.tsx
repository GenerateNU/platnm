import React, { useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useAnimatedValue,
  Animated,
} from "react-native";
import FollowNotification from "./FollowNotification";
import ReadDot from "./ReadDot";
import { toReadableTime } from "@/utils/utils";

export default function Notification({
  notification,
}: {
  notification: CustomNotification;
}) {
  const fadeAnim = useAnimatedValue(9); // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={
        notification.read
          ? styles.container
          : {
              ...styles.unreadContainer,
              backgroundColor: `#f2803705`,
            }
      }
    >
      <ReadDot read={notification.read} />
      <Image
        source={{
          uri: notification.thumbnail,
        }}
        style={styles.thumbnail}
      />
      {/* TODO: Render notification based on type */}
      <View style={{ width: "70%", marginLeft: 16 }}>
        <FollowNotification
          tagged={notification.tagged_entity_name}
          time={notification.created_at}
        />
      </View>
      <View style={{ alignItems: "flex-end", marginRight: 16 }}>
        <Text>{toReadableTime(new Date(notification.created_at))}</Text>
        <TouchableOpacity onPress={() => console.log("mark read")}>
          <Text
            style={{ fontWeight: "bold", fontSize: 28, textAlign: "right" }}
          >
            ...
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    width: "100%",
    justifyContent: "space-between",
    borderStyle: "solid",
    borderColor: "#f28037",
    borderWidth: 0,
  },
  unreadContainer: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: "auto",
  },
});
