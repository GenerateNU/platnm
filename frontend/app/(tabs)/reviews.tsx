import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { DateInputRating } from "@/components/DateInputRating";
import { StarRate } from "@/components/StarRate";
import { CommentRating } from "@/components/CommentRating";
import { Divider } from "react-native-paper";
import { useNavigation } from "expo-router";
import { SongCard } from "@/components/SongBanner";
import HeaderComponent from "@/components/HeaderComponent";

const Reviews = () => {
    const navigation = useNavigation(); // Get navigation object
  
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
                <HeaderComponent title="Log Song"/>
                <SongCard />
                <DateInputRating />
                <Divider />
                <StarRate />
                <Divider />
                <CommentRating />
            </View>
        </TouchableWithoutFeedback>
    );
  };
  
  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    backButton: {
      marginRight: 10,
    },
    backButtonText: {
      color: 'blue', // Adjust the color as needed
      fontSize: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
  
export default Reviews;