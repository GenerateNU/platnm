import { View, Text } from "react-native";
import React from "react";

export default function ReadDot({ read }: { read: boolean }) {
  return (
    <View
      style={
        !read
          ? {
              width: 10,
              height: 10,
              backgroundColor: "#2e70e8",
              borderRadius: 10,
              marginLeft: -16,
              marginRight: 8,
              marginTop: "auto",
              marginBottom: "auto",
            }
          : {}
      }
    />
  );
}
