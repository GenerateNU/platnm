import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Pressable, Touchable } from 'react-native';

import { Searchbar } from 'react-native-paper';
// @ts-ignore
import Cross from '@/assets/images/Icons/Cross';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import Search from '@/assets/images/Icons/search';
import { set } from 'lodash';
interface SearchBarProps {
	onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = React.useState('');
	const [searchFocused, setSearchFocused] = React.useState(false);
	const SEARCH_MAX = 8; // maximum number of recent searches we will store

	const handleSubmit = async () => {
		try {
			if (searchQuery.trim() != '') {
				await AsyncStorage.setItem(
					'recentSearches',
					JSON.stringify([
						searchQuery,
						...recentSearches.slice(0, Math.min(SEARCH_MAX - 1, recentSearches.length)),
					]),
				);
			}
		} catch (e) {
			console.log(e);
		}
		onSearch(searchQuery);
		setSearchFocused(false);
	};

	const fetchRecent = () => {
		AsyncStorage.getItem('recentSearches').then((value) => {
			if (value) {
				setRecentSearches(JSON.parse(value));
			}
		});
	};

	const deleteRecent = (search: string) => {
		const newRecentSearches = recentSearches.filter((item) => item !== search);
		AsyncStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
		setRecentSearches(newRecentSearches);
	};

	React.useEffect(() => {
		fetchRecent();
	}, []);

	const handleRecentSearch = (search: string) => {
		setSearchQuery(search);
		setSearchFocused(false);
		onSearch(search);
	};

	const [recentSearches, setRecentSearches] = React.useState<string[]>(['knock2', 'Katherine', 'Drake', 'dessy']);

	return (
		<View style={styles.container}>
			<Searchbar
				style={styles.searchBarContainer}
				placeholder='Search for Artist/Song/Album'
				onChangeText={setSearchQuery}
				onClearIconPress={() => onSearch('')}
				onSubmitEditing={handleSubmit}
				onFocus={() => {
					fetchRecent();
					setSearchFocused(true);
				}}
				// onBlur={() => setSearchFocused(false)}
				value={searchQuery}
			/>
			{searchFocused && recentSearches.length > 0 && (
				<View style={styles.recentSearchContainer}>
					{recentSearches.map((search, index) => (
						<TouchableOpacity
							key={index + search}
							onPressIn={() => handleRecentSearch(search)}
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingVertical: 4,
								borderBottomWidth: 1,
								borderBottomColor: '#eee',
								zIndex: 10,
							}}>
							<View style={{ flexDirection: 'row' }}>
								<Search
									width={16}
									height={16}
									fill='#000'
									style={{
										marginVertical: 'auto',
										alignSelf: 'flex-start',
										marginLeft: 8,
										marginRight: 16,
									}}
								/>
								<Text key={index} style={styles.recentSearch}>
									{search}
								</Text>
							</View>
							<TouchableOpacity
								onPressIn={() => deleteRecent(search)}
								style={{ marginVertical: 'auto', alignSelf: 'flex-end' }}>
								<Cross width={16} height={16} fill='#000' />
							</TouchableOpacity>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingLeft: 15,
	},
	searchBarContainer: {
		marginRight: 20,
		backgroundColor: '#EFf1f5',
	},
	recentSearch: {
		fontSize: 16,
		fontWeight: 'thin',
		paddingVertical: 12,
	},
	recentSearchContainer: {
		backgroundColor: 'white',
		paddingHorizontal: 8,
		paddingVertical: 24,
		marginRight: 20,
		paddingBottom: 1000,
	},
});

export default SearchBar;
