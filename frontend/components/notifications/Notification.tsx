import { View, Text } from 'react-native';
import { StyleSheet, Image, useAnimatedValue, Animated } from 'react-native';
import React, { useEffect } from 'react';
import FollowNotification from './FollowNotification';

export default function Notification({ notification }: { notification: CustomNotification }) {
	const fadeAnim = useAnimatedValue(9); // Initial value for opacity: 0

	const toReadableTime = (time: Date) => {
		let diffms = new Date().getTime() - time.getTime();
		let minuteDiff = Math.floor(diffms / 60000);
		if (minuteDiff < 1) {
			return 'now';
		}
		if (minuteDiff < 60) {
			return minuteDiff + 'm';
		}
		if (minuteDiff < 1440) {
			return Math.floor(minuteDiff / 60) + 'h';
		}
		return Math.floor(minuteDiff / 1440) + ' day' + (Math.floor(minuteDiff / 1440) > 1 ? 's' : '') + ' ago';
	};

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 5000,
			useNativeDriver: true,
		}).start();
	}, [fadeAnim]);

	return (
		<Animated.View
			style={
				notification.read
					? styles.container
					: { ...styles.unreadContainer, backgroundColor: `#f280370${fadeAnim}` }
			}>
			<View
				style={
					!notification.read
						? {
								width: 10,
								height: 10,
								backgroundColor: '#2e70e8',
								borderRadius: 10,
								marginLeft: -16,
								marginRight: 8,
								marginTop: 'auto',
								marginBottom: 'auto',
							}
						: {}
				}
			/>
			<Image source={{ uri: notification.thumbnail }} style={styles.thumbnail} />
			<FollowNotification tagged={notification.tagged_entity_name} time={notification.created_at} />
			<View style={{ alignItems: 'flex-end', marginRight: 16 }}>
				<Text>{toReadableTime(new Date(notification.created_at))}</Text>
				<Text style={{ fontWeight: 'bold', fontSize: 28, textAlign: 'right' }}>...</Text>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#fff',
		paddingVertical: 16,
		width: '100%',
		justifyContent: 'space-between',
		borderStyle: 'solid',
		borderColor: '#f28037',
		borderWidth: 0,
	},
	unreadContainer: {
		display: 'flex',
		flexDirection: 'row',
		paddingVertical: 16,
		justifyContent: 'space-between',
	},
	thumbnail: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginVertical: 'auto',
	},
});
