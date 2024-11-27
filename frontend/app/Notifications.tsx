import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import HeaderComponent from '@/components/HeaderComponent';
import { StyleSheet } from 'react-native';
import Notification from '@/components/notifications/Notification';

enum NotificationType {
	Follow = 'follow',
}

const Notifications = () => {
	const { userId } = useAuthContext();
	const [notifications, setNotifications] = useState<CustomNotification[]>([
		{
			id: 1,
			text: 'beak has now followed you!',
			type: NotificationType.Follow,
			taggedUser: 'beak',
			thumbnail: 'https://miro.medium.com/v2/resize:fit:736/1*YqfVlyCe06DfcPsR3kpYrw.jpeg',
			createdAt: 'now',
			read: false,
		},
		{
			id: 2,
			text: 'beak has now followed you!',
			type: NotificationType.Follow,
			taggedUser: 'beak',
			thumbnail: 'https://i.redd.it/tgnwy4m2ju741.jpg',
			createdAt: '2m',
			read: true,
		},
	]);

	const [oldNotifications, setOldNotifications] = useState<CustomNotification[]>([
		{
			id: 2,
			text: 'beak has now followed you!',
			type: NotificationType.Follow,
			taggedUser: 'beak',
			thumbnail: 'https://pbs.twimg.com/profile_images/1773603749438595072/m7Eqb-lP_400x400.jpg',
			createdAt: '2m',
			read: true,
		},
	]);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<HeaderComponent title='Your Notifications' />
			</View>
			<View style={styles.bodyContainer}>
				<Text style={styles.title}>Recent</Text>
				{notifications.map((notification, index) => {
					return <Notification key={index} notification={notification} />;
				})}
				<Text style={styles.title}>Last 7 Days</Text>
				{oldNotifications.map((notification, index) => {
					return <Notification key={index} notification={notification} />;
				})}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		paddingBottom: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	bodyContainer: {
		paddingHorizontal: 24,
		paddingVertical: 20,
	},
});

export default Notifications;
