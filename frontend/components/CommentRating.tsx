import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";


export function CommentRating() { 
    const [comment, setComment] = useState("");

    return (
        <View style={styles.comment}>
            <TextInput style={styles.input} multiline={true} placeholderTextColor="#434343" placeholder="Provide your thoughts..." value={comment} onChangeText={setComment} />
        </View>
    );
    }

const styles = StyleSheet.create({
    comment: {
      backgroundColor: "#ffffff",
      fontFamily: "Roboto",
      padding: 20,
      color: "#434343",
      fontSize: 19,
      height: '40%',
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        padding: 0,
    }
  });
  