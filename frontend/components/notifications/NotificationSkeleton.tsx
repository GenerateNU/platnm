import { View, Text } from "react-native";
import React from "react";
import SkeletonLoader from "expo-skeleton-loader";

export default function NotificationSkeleton({ count }: { count: number }) {
  return (
    <SkeletonLoader duration={1000} boneColor="#f0f0f0" highlightColor="#fff">
      <SkeletonLoader.Container>
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonLoader.Item
            key={index}
            style={{ width: 400, height: 50, marginBottom: 5 }}
          />
        ))}
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
}
