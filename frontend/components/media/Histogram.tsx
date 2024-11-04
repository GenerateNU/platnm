import { View, Text, StyleSheet } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory-native";

// TODO: build backend endpoint to get this data
const DATA = Array.from({ length: 11 }, (_, i) => ({
  rating: i,
  count: 20 + 30 * Math.random(),
}));

const Histogram = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rating Overview</Text>
      <VictoryChart padding={{ right: 50, left: 20, bottom: 30, top: 20 }}>
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { fontWeight: "bold" },
          }}
          crossAxis
          tickValues={[0, 10]}
        />
        <VictoryBar
          data={DATA}
          x="rating"
          y="count"
          barRatio={1}
          style={{
            data: { fill: "#F28037" },
            parent: { margin: 0 },
          }}
        />
      </VictoryChart>
    </View>
  );
};

export default Histogram;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
    fontStyle: "normal",
  },
});
