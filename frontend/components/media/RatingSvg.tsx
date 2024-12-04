import React from "react";
import { StyleSheet, View } from "react-native";
import Rating0 from "@/assets/images/Ratings/Property0.svg";
import Rating1 from "@/assets/images/Ratings/Property1.svg";
import Rating2 from "@/assets/images/Ratings/Property2.svg";
import Rating3 from "@/assets/images/Ratings/Property3.svg";
import Rating4 from "@/assets/images/Ratings/Property4.svg";
import Rating5 from "@/assets/images/Ratings/Property5.svg";
import Rating6 from "@/assets/images/Ratings/Property6.svg";
import Rating7 from "@/assets/images/Ratings/Property7.svg";
import Rating8 from "@/assets/images/Ratings/Property8.svg";
import Rating9 from "@/assets/images/Ratings/Property9.svg";
import Rating10 from "@/assets/images/Ratings/Property10.svg";

type RatingSvgProps = {
  rating: number;
  width: number;
  height: number;
};

const RatingSvg = ({ rating, width, height }: RatingSvgProps) => {
  const ratingImages = {
    0: Rating0,
    1: Rating1,
    2: Rating2,
    3: Rating3,
    4: Rating4,
    5: Rating5,
    6: Rating6,
    7: Rating7,
    8: Rating8,
    9: Rating9,
    10: Rating10,
  };

  const getRatingImage = (rating: keyof typeof ratingImages) => {
    return ratingImages[rating]; // Access the image from the preloaded images object
  };

  return (
    rating && (
      <View style={{ ...styles.rating, marginBottom: -(height / 2 - 5) }}>
        {React.createElement(
          getRatingImage(rating as keyof typeof ratingImages),
          { width, height },
          { style: styles.ratingImage } as any,
        )}
      </View>
    )
  );
};

export default RatingSvg;

const styles = StyleSheet.create({
  rating: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingImage: {
    alignSelf: "center",
  },
});
