import { Text, StyleSheet, View } from "react-native";
import React, { Component } from "react";

const Divider = () => {
  return <View style={styles.divider} />;
};
export default Divider;

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: "#00000080",
    borderBottomWidth: 1,
  },
});
