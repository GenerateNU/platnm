import * as React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { Searchbar } from 'react-native-paper';

const SearchBar = ({search}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

    
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    // Call the onSearch prop with the current query
    if (search) {
      search(query);
    }
  };

  return (
    <Searchbar
    style = {styles.searchBarContainer}
      placeholder="Search for Artist/Song/Album"
      onChangeText={handleSearch}
      value={searchQuery}
    />
  );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        marginRight: 20,
    }
})

export default SearchBar;
