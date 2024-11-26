import { Tabs } from 'expo-router';
import React from 'react';

import TabBarIcon from '@/components/navigation/TabBarIcon';
import HomeIcon from '@/assets/images/Navigation/Home.svg';
import FilledHomeIcon from '@/assets/images/Navigation/filledHome.svg';
import SearchIcon from '@/assets/images/Navigation/search.svg';
import ExploreIcon from '@/assets/images/Navigation/explore.svg';
import ProfileIcon from '@/assets/images/Navigation/profile.svg';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarLabel: () => null, // Ensure no label is displayed
			}}>
			<Tabs.Screen
				name='index'
				options={{
					tabBarIcon: ({ focused }) =>
						focused ? (
							<TabBarIcon Icon={FilledHomeIcon} focused={focused} />
						) : (
							<TabBarIcon Icon={HomeIcon} focused={focused} />
						),
				}}
			/>
			<Tabs.Screen
				name='search'
				options={{
					tabBarIcon: ({ focused }) => <TabBarIcon Icon={SearchIcon} focused={focused} />,
				}}
			/>
			<Tabs.Screen
				name='explore'
				options={{
					tabBarIcon: ({ focused }) => <TabBarIcon Icon={ExploreIcon} focused={focused} />,
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					tabBarIcon: ({ focused }) => <TabBarIcon Icon={ProfileIcon} focused={focused} />,
				}}
			/>
			<Tabs.Screen
				name='login'
				options={{
					title: 'Login',
					tabBarIcon: ({ focused }) => <TabBarIcon Icon={ProfileIcon} focused={focused} />,
				}}
			/>
		</Tabs>
	);
}
