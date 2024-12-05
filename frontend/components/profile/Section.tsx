import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import React, { useState, useEffect } from "react";

interface SectionProps {
  title: string;
  items: SectionItem[];
  isEditing: boolean;
  onAddItem: () => void;
  onDeleteSection: () => void;
  onDeleteItem: (index: number) => void;
}

const Section: React.FC<SectionProps> = ({
  title,
  items,
  isEditing,
  onAddItem,
  onDeleteSection,
  onDeleteItem,
}) => {
  const ITEM_LIMIT = 5;

  const addItemImage = require("@/assets/images/add-item-placeholder.png");

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.container}>
          {isEditing && (
            <>
              {items.length < ITEM_LIMIT && (
                <TouchableOpacity onPress={onAddItem} style={styles.plusIcon}>
                  <Icon name="plus" size={20} color="#F28037" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onDeleteSection}
                style={styles.trashIcon}
              >
                <Icon name="trash" size={20} color="#F28037" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Image
                source={{ uri: item.cover_photo }}
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
              {isEditing && (
                <TouchableOpacity
                  onPress={() => onDeleteItem(item.id)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "#D9D9D9",
                    borderRadius: 100,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>✖</Text>
                </TouchableOpacity>
              )}
              <Text style={{ marginTop: 5, textAlign: "center" }}>
                {item.title}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
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
    marginHorizontal: 0,
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
  itemCard: {
    width: 100,
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
