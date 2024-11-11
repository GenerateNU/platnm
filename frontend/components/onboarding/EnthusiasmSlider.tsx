import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import SliderTrack from "@/assets/images/slider-track.svg";
import TrackMark from "@/assets/images/track-mark.svg";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface EnthusiasmSliderProps {
  email: string;
}

const EnthusiasmSlider: React.FC<EnthusiasmSliderProps> = ({ email }) => {
  const [enthusiasmVal, setEnthusiasmVal] = useState(0);

  const mapEnthusiasm = (amount: number) => {
    switch (amount) {
      case -1:
        return "Occasional listener";
      case 0:
        return "Music lover";
      case 1:
        return "Expert";
      default:
        return "Music Lover";
    }
  };

  const putEnthusiasm = async () => {
    try {
      const requestBody = {
        email,
        music_enthusiasm: mapEnthusiasm(enthusiasmVal),
      };

      const response = await axios.put(
        `${BASE_URL}/users/enthusiasm`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        console.log("Enthusiasm updated successfully");
      } else {
        console.error("Failed to update enthusiasm");
      }
    } catch (error) {
      console.error("Error updating enthusiasm:", error);
    }
  };

  useEffect(() => {
    console.log("email from Enthusiasm: " + email);
    putEnthusiasm();
  }, [enthusiasmVal]);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.sliderLabel}>
          <Text style={styles.label}>Occasional Listener</Text>
          <Text style={styles.label}>Music Lover</Text>
          <Text style={styles.label}>Expert</Text>
        </View>
        <SliderTrack style={styles.trackImage} width="100%" height="20" />

        {/* TrackMarks */}
        {enthusiasmVal !== -1 && (
          <TrackMark style={{ ...styles.trackMark, left: "0%" }} />
        )}
        {enthusiasmVal !== 0 && (
          <TrackMark style={{ ...styles.trackMark, left: "46.5%" }} />
        )}
        {enthusiasmVal !== 1 && (
          <TrackMark style={{ ...styles.trackMark, left: "91.75%" }} />
        )}

        <Slider
          minimumValue={-1}
          maximumValue={1}
          value={enthusiasmVal}
          onValueChange={setEnthusiasmVal}
          step={1}
          style={styles.slider}
          thumbTintColor="black"
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
        />
      </View>
    </View>
  );
};

export default EnthusiasmSlider;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    marginHorizontal: 22,
    gap: 65,
    backgroundColor: "#FFFFFF",
    color: "black",
  },
  sliderContainer: {
    position: "relative",
    width: 350,
    height: 40,
    alignItems: "center",
  },
  trackImage: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -10 }],
    width: "100%",
    height: 20,
  },
  trackMark: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -8.5 }],
    width: 24,
    height: 17,
  },
  slider: {
    position: "absolute",
    width: "100%",
    height: 40,
  },
  sliderLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 2,
    alignItems: "flex-end",
    marginBottom: 3,
    top: -30,
  },
  label: {
    fontSize: 12,
    color: "black",
    maxWidth: 75,
    textAlign: "left",
  },
});
