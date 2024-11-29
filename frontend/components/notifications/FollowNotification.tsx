import { View, Text } from 'react-native';
import React from 'react';

type FollowNotificationProps = {
	tagged: string;
	time: string;
};

export default function FollowNotification({ tagged, time }: FollowNotificationProps) {
	return (
		<Text style={{ marginVertical: 'auto', width: '100%' }}>
			<Text style={{ fontWeight: 'bold' }}>{tagged}</Text> has now followed you!
		</Text>
	);
}
