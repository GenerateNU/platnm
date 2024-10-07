import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { ArrowUp } from "lucide-react-native";
import { MsIcon } from "material-symbols-react-native";
import { msArchive } from "@material-symbols-react-native/outlined-200";

export const ReviewButtons = () => {
  const [completed, setCompleted] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => console.log("Tried to access drafts.")}>
        <View
          style={[
            styles.halfButton,
            { backgroundColor: completed ? "#000000" : "#D9D9D9" },
          ]}
        >
          <MsIcon icon={msArchive} size={25} color={"white"} />
          <Text style={styles.text}>Drafts</Text>
        </View>
      </Pressable>

      {/* Conditionally enable the "Next" button based on completed */}
      <TouchableOpacity
        onPress={() => {
          if (completed) {
            console.log("Proceed to next step");
          }
        }}
        disabled={!completed}
      >
        <View
          style={[
            styles.halfButton,
            { backgroundColor: completed ? "#000000" : "#D9D9D9" },
          ]}
        >
          <Text style={styles.text}>Next</Text>
          <ArrowUp color="#FFFFFF" size={25} />
        </View>
      </TouchableOpacity>

      {/* Add a toggle button for testing purposes */}
      <Pressable
        onPress={() => setCompleted(!completed)}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleButtonText}>
          {completed ? "Mark Incomplete" : "Mark Complete"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
  halfButton: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 165,
    height: 50,
    columnGap: 3,
    borderRadius: 12,
  },
  text: {
    fontFamily: "Roboto",
    color: "#FFFFFF",
  },
  toggleButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#000000",
    borderRadius: 12,
  },
  toggleButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
});
