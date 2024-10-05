import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Rating } from "react-native-ratings"
import GreyStar from "@/components/GreyStar";


export function StarRating() { 

    const [rating, setRating] = useState(0);

    return (
        <View style={styles.ratingContainer}>
            <Text>Rating</Text>
            {/* <StarRatingComp
                rating={rating}
                onChange={setRating}
                color={"#555151"}
                emptyColor={"#C4C4C4"}
            /> */}

            <Rating
            type='custom'
            ratingImage={GreyStar}
            ratingColor='#555151'
            ratingBackgroundColor='#C4C4C4'
            ratingCount={5}
            imageSize={33}
            onFinishRating={this.rating}
            style={{ paddingVertical: 10 }}
            />
        </View>
    );
    }

const styles = StyleSheet.create({
    ratingContainer: {
      backgroundColor: "#ffffff",
      fontFamily: "Roboto",
      justifyContent: "space-between",
      flexDirection: 'row',
      padding: 20,
      color: "#434343",
      fontSize: 19,
    },
    stars: {
        flexDirection: 'row',
    }
  });
  