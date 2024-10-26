import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type DraftButtonProps = {
  handleClick: () => void;
};

const DraftButton = ({ handleClick }: DraftButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <View style={styles.row}>
          <Icon name="archive-outline" size={24} color="#FFF" />
          <Text style={styles.text}>Drafts</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#434343",
    borderRadius: 5,
    paddingLeft: 50,
    paddingRight: 50,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#FFF",
    marginLeft: 5,
  },
});

export default DraftButton;
