import React from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

type MediaCardProps = {
	media: Media;
	full?: boolean;
};

function isTrack(media: Media): media is Track {
	return (media as Track).album_id !== undefined;
}

const MediaCard = ({ media, full = false }: MediaCardProps) => {
	return (
		<View style={styles.container}>
			<ImageBackground
				style={full ? styles.fullBackground : styles.imageBackground}
				source={{ uri: media.cover }}>
				<LinearGradient
					// Background Linear Gradient
					colors={['rgba(0,0,0,0.6)', `rgba(242, 128, 55, ${full ? 1 : 0.6})`]}
					style={full ? styles.fullBackground : styles.background}>
					<View style={styles.contentContainer}>
						<View>
							<View style={styles.iconContainer}>
								<IconButton
									icon='arrow-left'
									iconColor='white'
									size={24}
									onPress={() => router.back()}
								/>
								<View style={styles.iconContainer}>
									<IconButton
										icon='export-variant'
										iconColor='white'
										size={24}
										onPress={() => console.log('More options pressed')}
									/>
									<IconButton
										icon='bookmark-outline'
										iconColor='white'
										size={24}
										onPress={() => console.log('More options pressed')}
									/>
								</View>
							</View>
							<View style={styles.artist}>
								<Image style={styles.image} source={{ uri: media.artist_photo }} />
								<Text style={styles.artistText}>{media.artist_name}</Text>
							</View>
							<Text style={styles.primaryMediaText}>{media.title}</Text>
							{isTrack(media) && <Text style={styles.albumText}>{media.album_title}</Text>}
						</View>
						{full && (
							<View style={styles.noReviewsContainer}>
								<Text
									style={{
										color: 'white',
										fontSize: 24,
										fontWeight: 'bold',
									}}>
									You've got taste!
								</Text>
								<Text style={styles.emptyText}>
									We dont have any reviews for this {media.media_type} yet.
								</Text>
								<Text style={styles.emptyText}>Be the first to leave a rating</Text>
							</View>
						)}
						<View style={styles.addReviewContainer}>
							<Button
								onPress={() =>
									router.push({
										pathname: '/CreateReview',
										params: {
											mediaName: media.title,
											mediaType: media.media_type,
											mediaId: media.id,
											cover: media.cover,
											artistName: media.artist_name,
										},
									})
								}
								icon={'plus'}
								textColor='white'>
								Rate
							</Button>
						</View>
					</View>
				</LinearGradient>
			</ImageBackground>
		</View>
	);
};

export default MediaCard;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
	noReviewsContainer: {
		flex: 1,
		margin: 'auto',
		marginTop: 128,
		width: '100%',
	},
	emptyText: {
		fontSize: 18,
		color: 'white',
		marginTop: 12,
		width: '80%',
	},
	imageBackground: {
		width: '100%',
		top: 32,
		marginTop: -32,
	},
	fullBackground: {
		width: '100%',
		height: Dimensions.get('window').height,
		opacity: 0.9,
		backgroundColor: 'black',
		paddingBottom: 24,
	},
	background: {
		height: 350,
	},
	contentContainer: {
		flex: 1,
		justifyContent: 'space-between',
		marginHorizontal: 16,
		marginTop: 28,
		marginBottom: 12,
	},
	iconContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	artist: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	artistText: {
		color: 'white',
		marginLeft: 5,
	},
	image: {
		width: 50,
		height: 50,
		marginBottom: 8,
		opacity: 0.6,
		borderRadius: 25,
	},
	primaryMediaText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
	},
	albumText: {
		marginTop: 4,
		fontSize: 16,
		fontWeight: 'bold',
		color: 'white',
	},
	addReviewContainer: {
		backgroundColor: '#000000',
		borderRadius: 8,
		padding: 8,
		opacity: 1,
		marginBottom: 16,
	},
});
