import { View, Text, StyleSheet } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from "victory-native";

interface HistogramProps {
  distribution: RatingDistribution[];
}

const Histogram = ({ distribution }: HistogramProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rating Overview</Text>
      <VictoryChart
        height={150}
        padding={{ right: 50, left: 20, bottom: 30, top: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { fontWeight: "bold" },
          }}
          crossAxis
          tickValues={[0, 10]}
        />
        <VictoryBar
          data={distribution}
          x="rating"
          y="count"
          barWidth={20}
          style={{
            data: { fill: "#F28037" },
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
