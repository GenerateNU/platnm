import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import HeaderComponent from '@/components/HeaderComponent';
import { StyleSheet } from 'react-native';
import Notification from '@/components/notifications/Notification';
import axios from 'axios';
enum NotificationType {
	Follow = 'follow',
}

const Notifications = () => {
	// const { userId } = useAuthContext();
	const userId = '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'; // Hardcoding - Get userId from navigation
	const [notifications, setNotifications] = useState<CustomNotification[]>([
		{
			created_at: '2024-11-28T22:05:59.617625-05:00',
			id: 1,
			tagged_entity_id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9d0e',
			tagged_entity_name: 'john_doe',
			tagged_entity_type: 'user',
			thumbnail:
				'https://preview.redd.it/tgnwy4m2ju741.jpg?width=640&crop=smart&auto=webp&s=90ad3b579c14db0dee54a4157dc3d5d71251baa4',
			type: 'follow' as NotificationType,
			read: false,
		},
	]);

	const [oldNotifications, setOldNotifications] = useState<CustomNotification[]>([]);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				console.log(userId);
				const response = await axios.get(`${process.env.EXPO_PUBLIC_BASE_URL}/users/notifications/${userId}`);
				console.log(response.data);
				// setNotifications(response.data);
			} catch (error) {
				console.error('Error fetching notifications:', error);
			}
		};
		fetchNotifications();
	}, []);

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
