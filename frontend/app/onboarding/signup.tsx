import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "@/components/onboarding/OnboardButton";
import { useAuthContext } from "@/components/AuthProvider";
import Header from "@/components/onboarding/Header";
import { useSharedValue, withTiming } from "react-native-reanimated";
import ProgressBar from "@/components/onboarding/ProgressBar";
// import GrayCircle from "@/assets/images/gray-circle.svg"
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import EnthusiasmSlider from "@/components/onboarding/EnthusiasmSlider";
import ArtistBubble from "@/components/onboarding/ArtistBubble";
import TrackBubble from "@/components/onboarding/TrackBubble";
import { useNavigation } from "expo-router";
import { router } from "expo-router";

const slides = [
  {
    id: 0,
    title: "Let's get started",
    question: "What is your name?",
    placeholder: "Enter Name",
  },
  {
    id: 1,
    title: "Account Information",
    question: "What is your email?",
    placeholder: "Enter Email",
  },
  {
    id: 2,
    title: "Account Information",
    question: "Pick a password",
    placeholder: "Enter Password",
  },
  {
    id: 3,
    title: "Account Information",
    question: "Pick a username",
    placeholder: "Enter Username",
  },
  {
    id: 4,
    title: "Link Music Account",
    question: "Link to your music account",
  },
  {
    id: 5,
    title: "Enthusiastic About Music?",
    question: "How would you categorize your love for music?",
  },
  {
    id: 6,
    title: "Favorite Artists",
    question: "Pick up to 5 of your favorite artists.",
  },
  {
    id: 7,
    title: "Favorite Songs",
    question: "Pick up to 5 of your favorite songs.",
  },
  {
    id: 8,
    title: "All Set!",
    question: "Explore PLATNM",
  },
];

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface TopArtist {
  name: string;
  profilePictureUrl: string;
  selected: boolean;
}

interface TopTrack {
  name: string;
  artist: string;
  imageUrl: string;
  selected: boolean;
}

const OnboardingCarousel: React.FC = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [inputValid, setInputValid] = useState(false);
  const [tried, setTried] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const navigation = useNavigation();

  const [enthusiasm, setEnthusiasm] = useState("");
  const { sessionToken, updateAccessToken, updateSession, updateUserId } =
    useAuthContext();

  const progressBar1 = useSharedValue(0);
  const progressBar2 = useSharedValue(0);
  const progressBar3 = useSharedValue(0);
  const progressBar4 = useSharedValue(0);
  const progressBar5 = useSharedValue(0);

  const emailFormat = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;

  useEffect(() => {
    if (currentSlide === 2) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword, currentSlide]);

  const handleSlideChange = (newSlideIndex: number) => {
    setPasswordVisible(false);
    setCurrentSlide(newSlideIndex);

    progressBar1.value = withTiming(newSlideIndex > 0 ? 1 : 0, {
      duration: 500,
    });

    progressBar2.value = withTiming(
      newSlideIndex > 1 ? (newSlideIndex - 1) / 3 : 0,
      {
        duration: 500,
      },
    );

    progressBar3.value = withTiming(newSlideIndex >= 5 ? 1 : 0, {
      duration: 500,
    });

    progressBar4.value = withTiming(newSlideIndex >= 6 ? 1 : 0, {
      duration: 500,
    });

    progressBar5.value = withTiming(newSlideIndex >= 7 ? 1 : 0, {
      duration: 500,
    });
  };

  const handleSignUp = async (): Promise<void> => {
    try {
      const res = await axios.post(`${BASE_URL}/users`, {
        display_name: name,
        email: email,
        password: password,
        username: username,
      });

      if (res.data.error) {
        alert("Error: " + res.data.error);
        return;
      }

      updateAccessToken(res.data["access_token"]);
      updateSession(res.headers["x-session"]);
      updateUserId(res.data["user_id"]);
    } catch (error) {
      console.log(error);
      alert("Signup Error");
    }
  };

  const handleSpotifyLogin = async (): Promise<void> => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/spotify/begin`, {
        validateStatus: function (status) {
          return status == 302;
        },
        headers: {
          "X-Session": sessionToken,
        },
      });

      const redirectUrl = res.headers["x-redirect"];

      router.push(redirectUrl);
    } catch (error) {
      console.log(error);
      alert("Spotify Login Error");
    }
  };

  const populateTopArtistsAndTopTracks = async (): Promise<void> => {
    try {
      const res = await axios.get(`${BASE_URL}/spotify/top-items`, {
        headers: {
          "X-Session": sessionToken,
        },
      });

      if (res.data.error) {
        alert("Error fetching top artists and tracks");
        return;
      }

      const artists: TopArtist[] = [];
      for (const artist of res.data.topArtists) {
        artists.push({
          name: artist.name,
          profilePictureUrl: artist.images[0].url,
          selected: false,
        });
      }

      const tracks: TopTrack[] = [];
      for (const track of res.data.topTracks) {
        tracks.push({
          name: track.name,
          artist: track.artists[0].name,
          imageUrl: track.album.images[0].url,
          selected: false,
        });
      }

      setTopArtists(artists);
      setTopTracks(tracks);
    } catch (error) {
      console.log(error);
      alert("Error fetching top artists and tracks");
    }
  };

  const handleNext = async () => {
    if (currentSlide === 3) {
      handleSlideChange(currentSlide + 1);
      handleSignUp();
      return;
    }
    if (currentSlide === 2 && !passwordMatch) {
      setTried(true);
      setInputValid(false);
      return;
    }

    if (currentSlide < slides.length - 1 && currentSlide > 4) {
      handleSlideChange(currentSlide + 1);
    }

    if (currentSlide === 4) {
      await populateTopArtistsAndTopTracks();
      handleSlideChange(currentSlide + 1);
    }

    if (currentSlide === 6 || currentSlide === 7) {
      handleSlideChange(currentSlide + 1);
    }

    if (inputValid) {
      handleSlideChange(currentSlide + 1);
      setInputValid(false);
    } else {
      setTried(true);
      setInputValid(false);
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Header
            title={slides[currentSlide].title}
            subtitle={slides[currentSlide].question}
          />

          {currentSlide === 8 ? (
            <View style={styles.allSetContainer}>
              <CustomButton
                text={"Let's Go ->"}
                onPress={() => router.push("/(tabs)/profile")}
                backgroundColor="#000000"
              />
            </View>
          ) : null}

          {currentSlide === 6 ? (
            <ScrollView>
              <View style={styles.artistGrid}>
                {topArtists.map((artist, index) => (
                  <Pressable
                    style={styles.artistContainer}
                    key={index}
                    onPress={(event) => {
                      event.preventDefault();
                      setTopArtists((prev) =>
                        prev.map((a, i) =>
                          i === index ? { ...a, selected: !a.selected } : a,
                        ),
                      );
                    }}
                  >
                    <ArtistBubble artist={artist} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : null}

          {currentSlide === 7 ? (
            <ScrollView style={styles.idk}>
              <View style={styles.trackGrid}>
                {topTracks.map((track, index) => (
                  <Pressable
                    style={styles.trackContainer}
                    key={index}
                    onPress={(event) => {
                      event.preventDefault();
                      setTopTracks((prev) =>
                        prev.map((t, i) =>
                          i === index ? { ...t, selected: !t.selected } : t,
                        ),
                      );
                    }}
                  >
                    <TrackBubble track={track} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : null}

          {currentSlide === 5 ? (
            <EnthusiasmSlider email={email} />
          ) : currentSlide === 2 ? (
            <View>
              <TextInput
                style={[
                  styles.input,
                  (!inputValid || passwordMatch) &&
                    tried && { borderColor: "#8b0000" },
                ]}
                placeholder="Enter Password"
                placeholderTextColor="#808080"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.input,
                  (!inputValid || passwordMatch) &&
                    tried && { borderColor: "#8b0000" },
                ]}
                placeholder="Confirm Password"
                placeholderTextColor="#808080"
                secureTextEntry={!passwordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onBlur={
                  password.length > 5
                    ? () => {
                        setInputValid(true);
                        setTried(false);
                      }
                    : () => setTried(true)
                }
              />
              {!passwordMatch && (
                <Text style={styles.errorText}>Passwords do not match.</Text>
              )}
              {tried && !inputValid && (
                <Text
                  style={[
                    styles.errorText,
                    currentSlide === 2 ? { bottom: 140 } : {},
                  ]}
                >
                  Is this correct?
                </Text>
              )}
            </View>
          ) : currentSlide === 4 ? (
            <View style={styles.buttonGroup}>
              <CustomButton
                text={"Log in with Spotify"}
                onPress={() => handleSpotifyLogin()}
                backgroundColor="#1DB954"
              />
              <CustomButton
                text={"Log in with Apple"}
                onPress={() => alert("Open with Apple Music")}
                backgroundColor="#000000"
              />
            </View>
          ) : (
            <View>
              {tried && !inputValid && currentSlide < 6 && (
                <Text
                  style={[
                    styles.errorText,
                    currentSlide === 2 ? { bottom: 10 } : {},
                  ]}
                >
                  Is this correct?
                </Text>
              )}
              {currentSlide < 4 ? (
                <TextInput
                  style={[
                    styles.input,
                    !inputValid && tried && { borderColor: "#8b0000" },
                  ]}
                  inputMode={currentSlide === 1 ? "email" : "text"}
                  placeholder={slides[currentSlide].placeholder}
                  placeholderTextColor="#808080"
                  autoComplete={currentSlide === 1 ? "email" : "off"}
                  value={
                    currentSlide === 0
                      ? name
                      : currentSlide === 1
                        ? email
                        : currentSlide === 3
                          ? username
                          : ""
                  }
                  onChangeText={
                    currentSlide === 0
                      ? setName
                      : currentSlide === 1
                        ? setEmail
                        : setUsername
                  }
                  onBlur={() => {
                    if (currentSlide === 1) {
                      setInputValid(emailFormat.test(email));
                    } else if (
                      (currentSlide === 0 && name.length > 1) ||
                      (currentSlide === 2 && password.length > 5) ||
                      (currentSlide === 3 && username.length > 0)
                    ) {
                      setInputValid(true);
                    }
                    setTried(false);
                  }}
                />
              ) : null}
            </View>
          )}

          <View style={styles.stickyContainer}>
            {currentSlide < 8 ? (
              <CustomButton
                text={"Continue"}
                onPress={handleNext}
                backgroundColor="#000000"
              />
            ) : null}
            <ProgressBar
              progress1={progressBar1}
              progress2={progressBar2}
              progress3={progressBar3}
              progress4={progressBar4}
              progress5={progressBar5}
              currentSlide={currentSlide}
              handleSlideChange={handleNext}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

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
  input: {
    height: 50,
    borderWidth: 1,
    width: "100%",
    borderColor: "#33333314",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  stickyContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
  },
  buttonGroup: {
    width: "100%",
    gap: 22,
  },
  errorText: {
    color: "#8b0000",
    fontSize: 14,
    position: "absolute",
    bottom: 72,
    paddingHorizontal: 5,
  },
  artistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  artistContainer: {
    width: "30%",
  },
  trackGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  trackContainer: {
    width: "40%",
  },
  allSetContainer: {
    marginTop: 80,
  },
  idk: {
    marginBottom: 100,
  },
});

export default OnboardingCarousel;
