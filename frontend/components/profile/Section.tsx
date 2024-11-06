import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import React, { useState, useEffect } from "react";

interface SectionProps {
  title: string;
  items: string[];
  isEditing: boolean;
  onAddItem: () => void;
  onDelete: () => void;
}

const Section: React.FC<SectionProps> = ({ title, items, isEditing, onAddItem, onDelete }) => {
  const [sectionTitle, setsectionTitle] = useState(title);
  const [editedItems, setEditedItems] = useState(items);
  const [editItem, setEditItem] = useState("");

  const handleItemChange = (text: string, index: number) => {
    const newItems = [...editedItems];
    newItems[index] = text;
    setEditedItems(newItems);
  };
  
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
          {isEditing ? (
            <TextInput
              value={sectionTitle}
              onChangeText={setsectionTitle}
              style={styles.sectionInput}
              multiline
            />
          ) : (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
        <View style={styles.container}>
        {isEditing &&
          <>
            <TouchableOpacity onPress={onAddItem} style={styles.plusIcon}>
              <Icon name="plus" size={20} color="#F28037" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.trashIcon}>
              <Icon name="trash" size={20} color="#F28037" />
            </TouchableOpacity>
          </>
        }
        </View>
      </View>
      <View style={styles.itemsRow}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            {isEditing ? (
              <TextInput
                value={item}
                onChangeText={(text) => handleItemChange(text, index)}
                style={styles.editText}
                multiline
              />) :
              (<Text style={styles.itemTitle}>{item}</Text>)}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: 'center',
  },
  plusIcon: {
    position: "absolute",
    right: 0,
    bottom: -10,
    backgroundColor: "transparent",
    padding: 4,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  trashIcon: {
    position: "absolute",
    right: -30,
    bottom: -10,
    backgroundColor: "transparent",
    padding: 4,
    borderRadius: 50,
    marginHorizontal: 5,
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
  sectionInput: {
    width: "80%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20, 
    fontSize: 16,
    color: "#666",
    backgroundColor: "#ddd",
    textAlign: "left",
  },
});
