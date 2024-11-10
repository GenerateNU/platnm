import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";

interface ProgressBarProps {
  progress1: SharedValue<number>;
  progress2: SharedValue<number>;
  progress3: SharedValue<number>;
  progress4: SharedValue<number>;
  progress5: SharedValue<number>;
  currentSlide: number;
  handleSlideChange: (slideIndex: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress1,
  progress2,
  progress3,
  progress4,
  progress5,
  currentSlide,
  handleSlideChange,
}) => {
  const progressBar1Style = useAnimatedStyle(() => ({
    width: `${Math.min(progress1.value, 1) * 100}%`,
  }));

  const progressBar2Style = useAnimatedStyle(() => ({
    width: `${Math.min(progress2.value, 1) * 100}%`,
  }));

  const progressBar3Style = useAnimatedStyle(() => ({
    width: `${Math.min(progress3.value, 1) * 100}%`,
  }));

  const progressBar4Style = useAnimatedStyle(() => ({
    width: `${Math.min(progress4.value, 1) * 100}%`,
  }));

  const progressBar5Style = useAnimatedStyle(() => ({
    width: `${Math.min(progress5.value, 1) * 100}%`,
  }));

  const handleProgressBarClick = (event: GestureResponderEvent) => {
    const width = 60; // Width of each progress bar
    const x = event.nativeEvent.locationX;
    const newSlideIndex = Math.floor((x / width) * 5);
    if (newSlideIndex < currentSlide) {
      handleSlideChange(newSlideIndex);
    }
  };

  return (
    <View style={styles.barsContainer}>
      <TouchableOpacity
        style={styles.barContainer}
        onPress={handleProgressBarClick}
      >
        <View style={styles.backgroundBar} />
        <Animated.View style={[styles.overlayBar, progressBar1Style]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.barContainer}
        onPress={handleProgressBarClick}
      >
        <View style={styles.backgroundBar} />
        <Animated.View style={[styles.overlayBar, progressBar2Style]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.barContainer}
        onPress={handleProgressBarClick}
      >
        <View style={styles.backgroundBar} />
        <Animated.View style={[styles.overlayBar, progressBar3Style]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.barContainer}
        onPress={handleProgressBarClick}
      >
        <View style={styles.backgroundBar} />
        <Animated.View style={[styles.overlayBar, progressBar4Style]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.barContainer}
        onPress={handleProgressBarClick}
      >
        <View style={styles.backgroundBar} />
        <Animated.View style={[styles.overlayBar, progressBar5Style]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  barContainer: {
    flex: 1,
    height: 5,
    marginHorizontal: 5,
    position: "relative",
  },
  backgroundBar: {
    height: "100%",
    backgroundColor: "#CCCCCC",
    borderRadius: 2,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayBar: {
    height: "100%",
    backgroundColor: "#000000",
    borderRadius: 2,
  },
});

export default ProgressBar;
