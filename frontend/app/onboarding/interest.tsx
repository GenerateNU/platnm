import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import OnboardingHeader from "@/components/onboarding/Header";
import SliderTrack from "@/assets/images/slider-track.svg"; // Assuming SliderTrack is an SVG component
import TrackMark from "@/assets/images/track-mark.svg"; // Assuming TrackMark is an SVG component
import ProgressBar from "@/components/onboarding/ProgressBar";
import OnboardButton from "@/components/onboarding/OnboardButton";
import { useRouter } from "expo-router";


export default function ArtistSearch() {
  const [amount, setAmount] = useState(0);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <OnboardingHeader title="Enthusiastic About Music?" subtitle="How would you categorize your love for music?" />
      
      <View>
      <View style={styles.sliderLabel}>
        <Text style={styles.label}>Occasional Listener</Text>
        <Text style={styles.label}>Music Lover</Text>
        <Text style={styles.label}>Expert</Text>
      </View>


      <View style={styles.sliderContainer}>
        {/* Background Track Image */}
        <SliderTrack style={styles.trackImage} width="100%" height="20" />

        {/* TrackMarks */}
        {amount !== -1 && <TrackMark style={{ ...styles.trackMark, left: "0%" }} />}
        {amount !== 0 && <TrackMark style={{ ...styles.trackMark, left: "46.5%" }} />}
        {amount !== 1 && <TrackMark style={{ ...styles.trackMark, left: "91.75%" }} />}

        {/* Slider Component */}
        <Slider
          minimumValue={-1}
          maximumValue={1}
          value={amount}
          onValueChange={setAmount}
          step={1}
          style={styles.slider}
          thumbTintColor="black" // Center thumb is black
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
        />
      </View>
      </View>
      <OnboardButton
                text={"Continue"}
                onPress={() => router.push("/onboarding/artists")}
                backgroundColor="#000000"
              />
      <ProgressBar progress1={0} progress2={0} currentSlide={1} handleSlideChange={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    marginTop: 230,
    marginHorizontal: 22,
    gap: 65,
    backgroundColor: "#FFFFFF",
    color: "black",
  },
  sliderContainer: {
    position: "relative",
    width: 350, // Width of the slider track
    height: 40,
    alignItems: "center",
  },
  trackImage: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -10 }], // Center the track image vertically
    width: "100%",
    height: 20,
  },
  trackMark: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -8.5 }], // Adjust to center within track image
    width: 24,
    height: 17,
  },
  slider: {
    position: "absolute",
    width: "100%", // Matches the width of the track
    height: 40,
  },
  sliderLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 2,
    alignItems: "flex-end"
  },
  label: {
    fontSize: 12,
    color: "black",
    maxWidth: 75,
    textAlign: "left",
  },
});
