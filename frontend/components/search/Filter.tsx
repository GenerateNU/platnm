import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface FilterProps {
  currentFilter: FilterOption;
  filterOptions: FilterOption[];
  onFilterChange: (filter: FilterOption) => void;
}

const Filter: React.FC<FilterProps> = ({
  currentFilter,
  filterOptions,
  onFilterChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsRow}>
        {filterOptions.map((filter: FilterOption) => (
          <TouchableOpacity
            key={filter}
            onPress={() => onFilterChange(filter)}
            style={[
              styles.button,
              currentFilter === filter && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                currentFilter === filter && styles.selectedButtonText,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} {}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.underline} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "black",
    marginLeft: 5,
  },
  selectedButtonText: {
    color: "#F28037",
  },
  selectedButton: {
    borderBottomWidth: 2, // Underline for selected button
    borderBottomColor: "#F28037", // Underline color
    marginBottom: -8,
  },
  underline: {
    width: "100%",
    height: 2,
    backgroundColor: "#E0E0E0",
  },
});

export default Filter;
