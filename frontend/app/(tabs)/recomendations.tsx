import { useState, useEffect } from 'react';

import { StyleSheet, Touchable } from 'react-native';

import UserRow from '@/components/UserRow';
import { View } from 'react-native';
import { SubpageHeader } from '@/components/SubpageHeader';
import { Dimensions } from 'react-native';
import { Text } from 'react-native';
import { RatingButton } from '@/components/RatingButton';
import SwipeCards from 'react-native-swipe-cards';
import { ImageBackground } from 'react-native';
import axios from 'axios';

import Play from '@/assets/images/Icons/play.svg';
import Info from '@/assets/images/Icons/info.svg';
import { TouchableOpacity } from 'react-native';

export default function RecommendationsScreen() {
	const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
	const userId = '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'; // Hardcoding - Get userId from navigation

	const [reccomendations, setRecommendations] = useState<any[]>([]);

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/recommendation/${userId}`);
				setRecommendations(response.data);
			} catch (error) {
				console.error('Error fetching user profile:', error);
			}
		};
		fetchUserProfile();
	}, [userId]);

	const reactToRecommendation = (id: string, reaction: boolean) => {
		axios.patch(`${BASE_URL}/recommendation/${id}`, { reaction: reaction, user_id: userId });
	};

	return (
		<View
			style={{
				backgroundColor: '#fff',
				minHeight: Dimensions.get('window').height,
			}}>
			<SubpageHeader title='Recommendations' />
			<UserRow />
			<View
				style={{
					height: Dimensions.get('window').height * 0.4,
				}}>
				<SwipeCards
					handleYup={(card) => reactToRecommendation(card.id, true)}
					handleNope={(card) => reactToRecommendation(card.id, false)}
					cards={[]}
					renderCard={({ artist, title, songType, url }: string) => {
						return (
							<View
								style={{
									borderRadius: 16,
								}}>
								<View style={styles.swipeContainer} />
								<ImageBackground
									source={{ uri: url }}
									imageStyle={{
										borderRadius: 16,
									}}
									style={styles.swipeCard}>
									<View style={styles.cardBottom}>
										<View style={{ flexDirection: 'row' }}>
											<View style={{ padding: 20 }}>
												<Text style={{ color: 'white', fontSize: 16 }}>{title}</Text>
												<View style={{ flexDirection: 'row', gap: 10 }}>
													<Text style={{ color: '#fff7', fontSize: 14 }}>{artist}</Text>
													<View
														style={{
															width: 5,
															height: 5,
															backgroundColor: '#fff7',
															borderRadius: 50,
															marginVertical: 'auto',
														}}
													/>
													<Text style={{ color: '#fff7', fontSize: 14 }}>{songType}</Text>
												</View>
											</View>

											<TouchableOpacity style={{ marginLeft: '25%' }}>
												<Play
													width={32}
													height={32}
													style={{ color: 'white', margin: 'auto' }}
												/>
											</TouchableOpacity>
											<TouchableOpacity>
												<Info
													width={32}
													height={32}
													style={{ color: 'white', margin: 'auto', marginLeft: 10 }}
												/>
											</TouchableOpacity>
										</View>
									</View>
								</ImageBackground>
							</View>
						);
					}}
				/>
			</View>
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					paddingTop: 50,
					flexDirection: 'row',
					gap: 32,
				}}>
				<RatingButton icon={'cross'} />
				<RatingButton icon={'heart'} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
	titleContainer: {
		flexDirection: 'row',
		gap: 8,
	},
	swipeContainer: {
		backgroundColor: '#D1D5DD',
		borderRadius: 16,
		width: Dimensions.get('window').width * 0.8,
		height: Dimensions.get('window').height * 0.4,

		position: 'absolute',
	},
	swipeCard: {
		width: Dimensions.get('window').width * 0.85,
		height: Dimensions.get('window').height * 0.4,
		marginHorizontal: 'auto',
	},
	cardBottom: {
		backgroundColor: 'rgba(57, 62, 70, 0.70)',
		marginTop: 'auto',
		borderRadius: 16,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
	},
});
