import React from "react";
import { StyleSheet, View } from "react-native";
import { RadialSlider } from "react-native-radial-slider";

type RatingSliderProps = {
  value: number;
  onRatingChange: (value: number) => void;
};

const RatingSlider = ({ value, onRatingChange }: RatingSliderProps) => {
  return (
    <View style={styles.container}>
      <View collapsable={false}>
        <RadialSlider
          value={value}
          min={0}
          max={10}
          onComplete={onRatingChange}
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
          radius={125}
          openingRadian={Math.PI / 2}
          valueStyle={{ color: "#FD5200", fontSize: 50 }}
          centerContentStyle={{
            backgroundColor: "black",
            borderRadius: 50,
            width: 100,
            height: 100,
            paddingLeft: 5,
            marginBottom: 40,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 175,
  },
});

export default RatingSlider;
