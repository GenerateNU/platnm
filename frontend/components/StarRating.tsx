import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Rating } from '@kolking/react-native-rating';

export function StarRating() { 

    const [rating, setRating] = useState(0);

    const handleChange = useCallback(
        (value: number) => setRating(Math.round((rating + value) * 5) / 10),
        [rating],
    );

    return (
        <View style={styles.ratingContainer}>
            <Text style={styles.rateText}>Rate</Text>
            <Rating 
                size={27} 
                rating={rating} 
                onChange={handleChange} 
                scale={1} 
                fillColor="#555151" 
                touchColor="#555151" 
                baseColor="#C4C4C4;" 
                spacing={10} 
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
  