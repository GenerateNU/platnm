import * as React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { Searchbar } from "react-native-paper";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSubmit = () => {
    onSearch(searchQuery);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        style={styles.searchBarContainer}
        placeholder="Search for Artist/Song/Album"
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSubmit}
        value={searchQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
  },
  searchBarContainer: {
    marginRight: 20,
  },
});

export default SearchBar;
