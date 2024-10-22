import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import React, { useState, useEffect } from "react";

interface SectionProps {
  title: string;
  items: string[];
  onEditPress: () => void;
}

const Section: React.FC<SectionProps> = ({ title, items, onEditPress }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity style={styles.editIcon}>
          <TouchableOpacity onPress={onEditPress} style={styles.editIcon}>
            <Icon name="edit-2" size={15} color="#888" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View style={styles.itemsRow}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemTitle}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  editIcon: {
    position: "absolute",
    right: -25,
    bottom: 20,
    backgroundColor: "transparent",
    padding: 4,
    borderRadius: 50,
  },
  editText: {
    fontSize: 16,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: {
    marginTop: 10,
    fontSize: 14,
  },
});
