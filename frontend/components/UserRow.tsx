import { View, Text } from "react-native";
import React from "react";

type Props = {};

const UserRow = (props: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#fff",
        padding: 20,
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: "#D9D9D9",
          borderRadius: 50,
        }}
      />
      <View style={{ marginVertical: "auto" }}>
        <Text
          style={{
            fontSize: 16,
            color: "#000",
            fontWeight: "500",
          }}
        >
          UserRow
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#393E46",
            fontWeight: "500",
          }}
        >
          19h
        </Text>
      </View>
    </View>
  );
};

export default UserRow;
