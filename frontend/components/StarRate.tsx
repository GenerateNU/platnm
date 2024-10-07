import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import StarRating from 'react-native-star-rating-widget';

export function StarRate() { 

    const [rating, setRating] = useState(0);

    const handleChange = useCallback(
        (value: number) => setRating(Math.round((rating + value) * 5) / 10),
        [rating],
    );

    return (
        <View style={styles.ratingContainer}>
            <Text style={styles.rateText}>Rate</Text>
            <StarRating
                rating={rating}
                onChange={setRating}
                emptyColor="#C4C4C4"
                color="#555151"
                animationConfig={{ scale: 1 }}
                starSize={30}
            />
        </View>
    );
    }

const styles = StyleSheet.create({
    ratingContainer: {
      backgroundColor: "#ffffff",
      fontFamily: "Roboto",
      justifyContent: "space-between",
      flexDirection: 'column',
      padding: 20,
      color: "#434343",
      fontSize: 19,
    },
    rateText: {
        marginBottom: 10,
    }
  });
  