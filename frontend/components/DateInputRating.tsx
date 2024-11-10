import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";

const DateInputRating = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setDate(new Date());
  }, []);

  return (
    <View style={styles.dateContainer}>
      <Text>Date</Text>
      <Text style={styles.dateText}>
        {date.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 20,
    color: "#434343",
    fontSize: 19,
    borderBottomColor: "##00000080",
    borderBottomWidth: 1,
  },

  dateText: {
    color: "#C4C4C4",
  },
});

export default DateInputRating;
