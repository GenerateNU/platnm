import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { RadialSlider } from "react-native-radial-slider";

const RatingSlider = () => {
  const [speed, setSpeed] = useState(0);

  return (
    <View style={styles.container}>
      <RadialSlider
        value={speed}
        min={0}
        max={10}
        onChange={setSpeed}
        unit={""}
        subTitle={""}
        isHideLines={true}
        isHideButtons={true}
        isHideTailText={true}
        thumbColor={"white"}
        thumbBorderColor="#0a0d120f"
        stroke="#FD5200"
        linearGradient={[
          { offset: "0%", color: "#FD5200" },
          { offset: "100%", color: "#FD5200" },
        ]}
        radius={150}
        openingRadian={Math.PI / 2}
        valueStyle={{ color: "#FD5200", fontSize: 50 }}
        centerContentStyle={{
          backgroundColor: "black",
          borderRadius: 60,
          width: 120,
          height: 120,
          paddingLeft: 5,
          marginBottom: 40,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
});

export default RatingSlider;
