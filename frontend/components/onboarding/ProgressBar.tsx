import React from 'react';
import { View, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ProgressBarProps {
  progress1: any; // First progress bar value (Reanimated shared value)
  progress2: any; // Second progress bar value (Reanimated shared value) -- TRY TO REMOVE ANY
  currentSlide: number; // The current slide index
  handleSlideChange: (slideIndex: number) => void; // Function to handle click on the progress bar
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress1, progress2, currentSlide, handleSlideChange }) => {
  const progressBar1Style = useAnimatedStyle(() => ({
    width: `${progress1.value * 100}%`,
  }));

  const progressBar2Style = useAnimatedStyle(() => ({
    width: `${progress2.value * 100}%`,
  }));

  const handleProgressBarClick = (event: GestureResponderEvent) => {
    const width = 60; // Width of the bar
    const x = event.nativeEvent.locationX; 
    const newSlideIndex = Math.floor((x / width) * 5);
    handleSlideChange(newSlideIndex); 
  };

  return (
    <View style={styles.barsContainer}>
      <TouchableOpacity
        style={styles.barContainer}
        onPress={(event) => handleProgressBarClick(event)}
      >
        <View style={styles.backgroundBar} />
        <Animated.View style={[styles.overlayBar, progressBar1Style]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.barContainer}
        onPress={(event) => handleProgressBarClick(event)}
      >
        <View style={styles.backgroundBar} />
        <Animated.View style={[styles.overlayBar, progressBar2Style]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.barContainer}
        onPress={(event) => handleProgressBarClick(event)}
      >
        <View style={styles.backgroundBar} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.barContainer}
        onPress={(event) => handleProgressBarClick(event)}
      >
        <View style={styles.backgroundBar} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  barContainer: {
    flex: 1,
    height: 5,
    marginHorizontal: 5,
    position: 'relative', 
  },
  backgroundBar: {
    height: '100%',
    backgroundColor: '#CCCCCC',
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayBar: {
    height: '100%',
    backgroundColor: '#000000', // Black overlay for progress
    borderRadius: 2,
  },
});

export default ProgressBar;
