import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

interface ReviewPageProps {
  route: {
    params: {
      review_id: string;
    };
  };
}

const ReviewPage: React.FC<ReviewPageProps> = ({ route }) => {
  const { review_id } = route.params; // Access the review data passed from the previous screen
  const [review, setReview] = useState<Preview>();
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  // Fetch the review data using the review_id
  useEffect(() => {
    const fetchReview = async () => {
      console.log("fetchReviews");
      try {
        const response = await axios.get(`${BASE_URL}/review/${review_id}`);
        setReview(response.data);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, []);

  return (
    review ? (
      <ScrollView style={styles.container}>
        <View style={styles.reviewContainer}>
          <Image source={{ uri: review.media_cover }} style={styles.coverImage} />
          <Text style={styles.songName}>{review.media_title}</Text>
          <Text style={styles.artistName}>{review.media_artist}</Text>
          <Text style={styles.comment}>{review.comment}</Text>
          <Text style={styles.rating}>Rating: {review.rating}</Text>
          {/* {/* {* Add any other review details you want to show */}
        </View>
      </ScrollView>
    ) : (
      <Text>Loading...</Text>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  reviewContainer: {
    alignItems: 'center',
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  songName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 18,
    color: '#888',
  },
  comment: {
    fontSize: 16,
    marginVertical: 10,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewPage;
