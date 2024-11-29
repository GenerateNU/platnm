import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type FilterOption = "all" | "songs" | "albums" | "profile";

interface FilterProps {
  currentFilter: FilterOption;
  filterOptions: String[];
  onFilterChange: (filter: FilterOption) => void;
}

const Filter: React.FC<FilterProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          onPress={() => onFilterChange("all")}
          style={[styles.button]}
        >
          <Text
            style={[
              styles.buttonText,
              currentFilter === "all" && styles.selectedButtonText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onFilterChange("songs")}
          style={[styles.button]}
        >
          <Text
            style={[
              styles.buttonText,
              currentFilter === "songs" && styles.selectedButtonText,
            ]}
          >
            Songs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onFilterChange("albums")}
          style={[styles.button]}
        >
          <Text
            style={[
              styles.buttonText,
              currentFilter === "albums" && styles.selectedButtonText,
            ]}
          >
            Albums
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onFilterChange("profile")}
          style={[styles.button]}
        >
          <Text
            style={[
              styles.buttonText,
              currentFilter === "profile" && styles.selectedButtonText,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.underline}></View>
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
    color: "orange",
  },
  underline: {
    width: "100%",
    height: 2,
    backgroundColor: "#E0E0E0",
  },
});

export default Filter;
