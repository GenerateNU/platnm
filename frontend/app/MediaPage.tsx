import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import Histogram from '@/components/media/Histogram';
import YourRatings from '@/components/media/YourRatings';
import FriendRatings from '@/components/media/FriendRatings';
import MediaCard from '@/components/media/MediaCard';
import ReviewStats from '@/components/media/ReviewStats';
import ReviewPreview from '@/components/ReviewPreview';
import SkeletonLoader from 'expo-skeleton-loader';

export default function MediaPage() {
	const [media, setMedia] = useState<Media>();
	const [reviews, setReviews] = useState<Review[]>([]);
	const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
	const [avgRating, setAvgRating] = useState<number | null>(null);
	const [ratingDistributions, setRatingDistributions] = useState<RatingDistribution[]>([]);

	const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
	const { mediaId, mediaType } = useLocalSearchParams<{
		mediaId: string;
		mediaType: string;
	}>();

	useEffect(() => {
		setReviewsLoading(true);
		axios
			.get(`${BASE_URL}/media/${mediaType}/${mediaId}`)
			.then((response) => setMedia(response.data))
			.catch((error) => console.error(error));
	}, []);

	// calculating the rating distribution from the reviews that we already have
	useEffect(() => {
		const calculateRatingDistribution = () => {
			const distributionMap = new Map<number, number>();
			if (!reviews) {
				setRatingDistributions([]);
				return;
			}

			reviews.forEach((review) => {
				distributionMap.set(review.rating, (distributionMap.get(review.rating) || 0) + 1);
			});

			const distributionArray = Array.from(distributionMap, ([rating, count]) => ({
				rating,
				count,
			})).sort((a, b) => a.rating - b.rating);

			setRatingDistributions(distributionArray);
		};

		calculateRatingDistribution();
	}, [reviews]);

	useFocusEffect(
		useCallback(() => {
			if (media) {
				axios
					.get(`${BASE_URL}/reviews/${mediaType}/${mediaId}`)
					.then((response) => {
						setReviews(response.data.reviews);
						setReviewsLoading(false);
						setAvgRating(Math.round(response.data.avgRating) || null);
					})
					.catch((error) => console.error(error));
			}
		}, [media]),
	);

	if (media) {
		// We have the media, but no reviews
		if ((!reviewsLoading && reviews?.length === 0) || reviews == null) {
			return (
				<View>
					<MediaCard media={media} full={true} />
				</View>
			);
		}
	} else {
		// This is technically an error state
		// TODO: add a fallback screen
		return (
			<View>
				<Text>{mediaId}</Text>
				<Text>{mediaType}</Text>
			</View>
		);
	}

	return (
		media && (
			<View style={{ backgroundColor: '#FFF' }}>
				<ScrollView
					style={{
						...styles.scrollView,
					}}
					contentContainerStyle={{
						paddingBottom: 80, // Add padding at the bottom equal to the height of the bottom tab bar
					}}>
					<MediaCard media={media} />
					{reviewsLoading ? (
						<View style={styles.bodyContainer}>
							<SkeletonLoader duration={1000} boneColor='#f0f0f0' highlightColor='#fff'>
								<SkeletonLoader.Container
									style={[{ flex: 1, flexDirection: 'row' }, styles.titleContainer]}>
									<SkeletonLoader.Item style={{ width: 150, height: 50, marginBottom: 5 }} />
									<SkeletonLoader.Item style={{ width: 150, height: 50, marginLeft: 30 }} />
								</SkeletonLoader.Container>
								<SkeletonLoader.Container style={styles.titleContainer}>
									<SkeletonLoader.Item style={{ width: 335, height: 100, marginTop: 25 }} />
								</SkeletonLoader.Container>
								<SkeletonLoader.Container style={styles.titleContainer}>
									<SkeletonLoader.Item style={{ width: 335, height: 80, marginTop: 25 }} />
								</SkeletonLoader.Container>
							</SkeletonLoader>
						</View>
					) : (
						<View style={styles.bodyContainer}>
							<View style={styles.titleContainer}>
								{avgRating && <ReviewStats rating={avgRating} reviews={reviews} />}
							</View>
							{ratingDistributions && ratingDistributions.length > 0 && (
								<Histogram distribution={ratingDistributions} />
							)}
							<View style={styles.socialContainer}>
								<YourRatings user_id={userId} media_id={mediaId} media_type={mediaType} />
								<FriendRatings count={5} />
							</View>
							<View>
								{reviews?.map((review) => (
									<ReviewPreview
										key={review.id}
										preview={{
											...review,
											review_id: review.id,
											created_at: new Date(review.created_at),
											updated_at: new Date(review.updated_at),
											media_title: media.title,
											tags: ['Excitement'],
											review_stat: {
												comment_count: 5,
												upvotes: 4,
												downvotes: 2,
											},
											media_artist: media.artist_name,
											media_cover: media.cover,
										}}
									/>
								))}
							</View>
						</View>
					)}
				</ScrollView>
			</View>
		)
	);
}

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: '#FFF',
		paddingBottom: 100,
	},
	titleContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	metadataContainer: {
		width: '100%',
		flexDirection: 'row',
		alignSelf: 'center',
	},
	socialContainer: {
		flexDirection: 'column',
		gap: 8,
	},
	bodyContainer: {
		marginTop: 16,
		paddingTop: 32,
		paddingHorizontal: 16,
		borderRadius: 16,
		backgroundColor: '#fff',
	},

	buttonContainer: {
		flexDirection: 'row',
		gap: 8,
		marginVertical: 16,
	},
	addReviewContainer: {
		backgroundColor: '#000000',
		borderRadius: 8,
		flexGrow: 2,
		padding: 8,
	},
});
