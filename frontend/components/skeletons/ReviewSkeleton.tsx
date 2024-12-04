import SkeletonLoader from "expo-skeleton-loader";
import React from "react";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = {
  loadingReview: {
    width: width - 16,
    height: 200,
    marginTop: 25,
    borderRadius: 16,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
    borderColor: "#ddd",
    borderWidth: 0.5,
  },
};

const ReviewSkeleton = () => {
  return (
    <SkeletonLoader.Container>
      <SkeletonLoader.Item style={styles.loadingReview} />
    </SkeletonLoader.Container>
  );
};

export default ReviewSkeleton;
