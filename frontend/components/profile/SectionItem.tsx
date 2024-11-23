import axios from 'axios';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface SectionItemProps {
	rank: number;
	id: string;
	artist_name: string;
	title: string;
	cover: string;
}

const SectionItem: React.FC<SectionItemProps> = ({ id, rank, artist_name, title, cover }) => {
	const placeholderImage =
		'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png';
	const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
	// const { userId, sectionId } = useLocalSearchParams<{
	//   type: string;
	// }>();

	const userId = '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d';
	const sectionId = id;

	return (
		<TouchableOpacity
			style={styles.cardContainer}
			onPress={async () => {
				console.log(title, artist_name, cover);
				console.log(`${BASE_URL}/users/section/item/${userId}/${sectionId}`);
				const response = await axios.post(`${BASE_URL}/users/section/item/${userId}/${sectionId}`, {
					title: title,
					cover_photo: cover,
				});
				router.push('/profile');
			}}>
			<View style={styles.mediaContainer}>
				{/* Rank */}
				<Text style={styles.rank}>{rank}.</Text>

				{/* Album Cover */}
				<View style={styles.coverContainer}>
					<Image source={{ uri: cover || placeholderImage }} style={styles.cover} />
				</View>

				{/* Record Image */}
				<View style={styles.recordContainer}>
					<Image source={require('@/assets/images/Profile/record.png')} style={styles.recordImage} />
				</View>
			</View>

			{/* Album and Artist Name */}
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.artistName}>{artist_name}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	cardContainer: {
		alignItems: 'flex-start',
		marginRight: 25,
		marginBottom: 16,
		width: 140,
	},
	mediaContainer: {
		flexDirection: 'row', // Set horizontal layout to align rank and cover side-by-side
		alignItems: 'center', // Align items vertically centered
		position: 'relative',
	},
	rank: {
		color: '#000',
		fontSize: 18,
		fontWeight: '600',
		lineHeight: 20,
		marginRight: 6, // Spacing between rank and cover image
		marginTop: -85,
	},
	coverContainer: {
		zIndex: 2, // Ensure cover is on top
	},
	recordContainer: {
		position: 'absolute', // Position record on top of cover
		bottom: 5,
		left: '50%',
		transform: [{ translateX: 0 }],
	},
	recordImage: {
		width: 100,
		height: 100,
	},
	cover: {
		width: 110,
		height: 110,
		borderRadius: 8,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#434343',
		marginTop: 4,
		textAlign: 'left',
		marginLeft: 24,
	},
	artistName: {
		fontSize: 14,
		color: '#434343',
		textAlign: 'left',
		marginLeft: 24,
	},
});

export default SectionItem;
