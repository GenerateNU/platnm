import { View, Text, ScrollView } from 'react-native';
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
	const [notifications, setNotifications] = useState<CustomNotification[]>([]);
	const [oldNotifications, setOldNotifications] = useState<CustomNotification[]>([]);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				console.log(userId);
				const response = await axios.get(`${process.env.EXPO_PUBLIC_BASE_URL}/users/notifications/${userId}`);
				console.log(response.data);
				// TODO: sort into old and new notifications if its older than 7 days
				const notifications = response.data.map((notification: any) => ({ ...notification, read: true }));

				setNotifications(notifications);
			} catch (error) {
				console.error('Error fetching notifications:', error);
			}
		};
		fetchNotifications();
	}, [userId]);

	useEffect(() => {
		console.log('notifications', notifications);
	}, [notifications]);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<HeaderComponent title='Your Notifications' />
			</View>
			<ScrollView style={styles.bodyContainer}>
				<Text style={styles.title}>Recent</Text>

				{notifications.length > 0 &&
					notifications.map((notification, index) => {
						return <Notification key={index} notification={notification} />;
					})}
				<Text style={styles.title}>Last 7 Days</Text>
				{oldNotifications.map((notification, index) => {
					return <Notification key={index} notification={notification} />;
				})}
			</ScrollView>
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
