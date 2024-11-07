import { View, Text, Image } from 'react-native';
import React from 'react';
import { RecommendationsCard } from '@/components/recomendations/RecommendationsScreen';

type Props = {
	recomendations: RecommendationsCard[];
};

const UserRow = ({ recomendations }: Props) => {
	console.log('recomendations');
	console.log(recomendations);
	if (recomendations.length === 0) {
		return <View />;
	}
	return (
		<View
			style={{
				flexDirection: 'row',
				gap: 10,
				backgroundColor: '#fff',
				padding: 20,
			}}>
			<Image
				source={{ uri: recomendations[0].receommender_picture }}
				style={{ width: 50, height: 50, borderRadius: 25 }}
			/>
			<View style={{ marginVertical: 'auto' }}>
				<Text
					style={{
						fontSize: 16,
						color: '#000',
						fontWeight: '500',
					}}>
					{recomendations[0].recomender_name}
				</Text>
				<Text
					style={{
						fontSize: 14,
						color: '#393E46',
						fontWeight: '500',
					}}>
					19h
				</Text>
			</View>
		</View>
	);
};

export default UserRow;
