import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { DateInputRating } from "@/components/DateInputRating";
import { StarRating } from "@/components/StarRating";
import { CommentRating } from "@/components/CommentRating";
import { Divider } from "react-native-paper";
import { useNavigation } from "expo-router";

const Reviews = () => {
    const navigation = useNavigation(); // Get navigation object
  
    return (
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Album</Text>
        </View>
        <DateInputRating />
        <Divider />
        <StarRating />
        <Divider />
        <CommentRating />
      </View>
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