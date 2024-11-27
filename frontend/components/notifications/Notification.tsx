import { View, Text } from 'react-native';
import { StyleSheet, Image, Dimensions } from 'react-native';
import React from 'react';
import FollowNotification from './FollowNotification';

export default function Notification({ notification }: { notification: CustomNotification }) {
	return (
		<View style={notification.read ? styles.container : styles.unreadContainer}>
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
			<FollowNotification tagged={notification.taggedUser} time={notification.createdAt} />
			<View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: 16 }}>
				<Text style={{ textAlign: 'right' }}>{notification.createdAt}</Text>
				<Text style={{ fontWeight: 'bold', fontSize: 28, textAlign: 'right' }}>...</Text>
			</View>
		</View>
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
		backgroundColor: '#f2803710',
		paddingVertical: 16,
		justifyContent: 'space-between',
	},
	thumbnail: {
		width: 50,
		height: 50,
		borderRadius: 25,
		left: 0,
		position: 'absolute',
		marginVertical: 'auto',
		marginTop: 16,
	},
});
