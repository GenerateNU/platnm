import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useColorScheme } from "react-native";

interface TabBarIconProps {
  Icon: React.FC<{ style?: React.CSSProperties }>;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ Icon, focused }) => {
  const colorScheme = useColorScheme();

  // Define colors based on the color scheme
  const activeColor = colorScheme === "dark" ? "#D3D3D3" : "#1E1E1E"; // selected
  const inactiveColor = colorScheme === "dark" ? "#B0B0B0" : "#A09CAB"; // Light gray in dark mode
  const dotColor = colorScheme === "dark" ? "#D3D3D3" : "#1C1B1F"; // Dot color based on mode

  const dotPosition = useRef(new Animated.Value(0)).current;
  const iconY = useRef(new Animated.Value(0)).current;
  const opacity = focused ? 0.9 : 0.6; // Opacity based on focus

  useEffect(() => {
    Animated.parallel([
      Animated.timing(dotPosition, {
        toValue: focused ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(iconY, {
        toValue: focused ? -2 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: iconY }] }}>
        <Icon
          style={{
            color: focused ? activeColor : inactiveColor,
            opacity,
            width: 24,
          }}
        />
      </Animated.View>
      {focused && (
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: dotColor,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 10,
    height: 60,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1.5,
  },
});

export default TabBarIcon;
