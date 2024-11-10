import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type FilterOption = 'all' | 'songs' | 'albums';

interface FilterProps {
  onFilterChange: (filter: FilterOption) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');

  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleFilterChange('all')} style={[styles.button, selectedFilter === 'all' && styles.selectedButton]}>
        <Icon name="apps-outline" size={20} color="white" />
        <Text style={styles.buttonText}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleFilterChange('songs')} style={[styles.button, selectedFilter === 'songs' && styles.selectedButton]}>
        <Icon name="musical-notes-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Songs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleFilterChange('albums')} style={[styles.button, selectedFilter === 'albums' && styles.selectedButton]}>
        <Icon name="albums-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Albums</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', margin: 10 },
  button: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 5, marginHorizontal: 5, backgroundColor: '#ccc' },
  selectedButton: { backgroundColor: '#007AFF' },
  buttonText: { color: 'white', marginLeft: 5 },
});

export default Filter;
