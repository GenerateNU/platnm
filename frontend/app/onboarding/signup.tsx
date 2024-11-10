import React, { useReducer, useEffect } from "react";
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

const initialState = {
  currentSlide: 0,
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  passwordMatch: true,
  inputValid: false,
  tried: false,
  passwordVisible: false,
  enthusiasm: "",
  topTracks: [],
  topArtists: [],
};

type State = typeof initialState;

type Action =
  | { type: "UPDATE_FIELD"; field: keyof State; value: any }
  | { type: "SET_SLIDE"; slide: number }
  | { type: "TOGGLE_PASSWORD_VISIBILITY" }
  | { type: "SET_PASSWORD_MATCH"; match: boolean }
  | { type: "SET_TRIED"; tried: boolean }
  | { type: "SET_INPUT_VALID"; valid: boolean }
  | { type: "SET_TOP_TRACKS"; topTracks: any }
  | { type: "SET_TOP_ARTISTS"; topArtists: any };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_SLIDE":
      return {
        ...state,
        currentSlide: action.slide,
        passwordVisible: false,
        tried: false,
      };
    case "TOGGLE_PASSWORD_VISIBILITY":
      return { ...state, passwordVisible: !state.passwordVisible };
    case "SET_PASSWORD_MATCH":
      return { ...state, passwordMatch: action.match };
    case "SET_TRIED":
      return { ...state, tried: action.tried };
    case "SET_INPUT_VALID":
      return { ...state, inputValid: action.valid };
    case "SET_TOP_TRACKS":
      return { ...state, topTracks: action.topTracks };
    case "SET_TOP_ARTISTS":
      return { ...state, topArtists: action.topArtists };
    default:
      return state;
  }
};

const OnboardingCarousel: React.FC = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { sessionToken, updateAccessToken, updateSession } = useAuthContext();

  const progressBars = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const emailFormat = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;
  const handleSlideChange = (newSlideIndex: number) => {
    dispatch({ type: "SET_SLIDE", slide: newSlideIndex });
    progressBars[0].value = withTiming(newSlideIndex > 0 ? 1 : 0, {
      duration: 500,
    });
    progressBars[1].value = withTiming(
      newSlideIndex > 1 ? (newSlideIndex - 1) / 3 : 0,
      { duration: 500 }
    );
    progressBars[2].value = withTiming(newSlideIndex >= 5 ? 1 : 0, {
      duration: 500,
    });
    progressBars[3].value = withTiming(newSlideIndex >= 6 ? 1 : 0, {
      duration: 500,
    });

    progressBars[4].value = withTiming(newSlideIndex >= 7 ? 1 : 0, {
      duration: 500,
    });
  };

  const handleSignUp = async (): Promise<void> => {
    try {
      console.log(
        "Creating user: $1, $2, $3, $4",
        state.name,
        state.email,
        state.password,
        state.username
      );

      const res = await axios.post(`${BASE_URL}/users`, {
        display_name: state.name,
        email: state.email,
        password: state.password,
        username: state.username,
      });

      if (res.data.error) {
        alert("Error: " + res.data.error);
        return;
      }

      updateAccessToken(res.data["access_token"]);
      updateSession(res.headers["x-session"]);
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
      console.log(redirectUrl);

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

      dispatch({ type: "SET_TOP_ARTISTS", topArtists: artists });
      dispatch({ type: "SET_TOP_TRACKS", topTracks: tracks });
    } catch (error) {
      console.log(error);
      alert("Error fetching top artists and tracks");
    }
  };

  const handleNext = async () => {
    console.log(
      "slide: " +
        state.currentSlide +
        " tried: " +
        state.tried +
        " valid: " +
        state.inputValid
    );

    if (state.currentSlide === 4) {
      await populateTopArtistsAndTopTracks();
      if (sessionToken !== "sessionStartsLikeThis") {
        dispatch({ type: "SET_INPUT_VALID", valid: true });
      }
      handleSlideChange(state.currentSlide + 1);
      return;
    }

    if (state.currentSlide === 1 && !emailFormat.test(state.email)) {
      dispatch({ type: "SET_TRIED", tried: true });
      dispatch({ type: "SET_INPUT_VALID", valid: false });
      return;
    }

    if (state.inputValid) {
      if (state.currentSlide === 3) {
        console.log("called signup");
        handleSignUp();
      }
      handleSlideChange(state.currentSlide + 1);
      dispatch({ type: "SET_INPUT_VALID", valid: false });
    } else {
      dispatch({ type: "SET_TRIED", tried: true });
      dispatch({ type: "SET_INPUT_VALID", valid: false });
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Header
            title={slides[state.currentSlide].title}
            subtitle={slides[state.currentSlide].question}
          />
          {state.tried &&
            !state.inputValid &&
            (state.currentSlide === 2 ? (
              !state.passwordMatch ? (
                <Text style={styles.errorText}>Passwords do not match.</Text>
              ) : (
                <Text style={styles.errorText}>Minimum Length: 8</Text>
              )
            ) : (
              <Text style={styles.errorText}>Is this correct?</Text>
            ))}

          {state.currentSlide === 8 ? (
            <View style={styles.allSetContainer}>
              <CustomButton
                text={"Let's Go ->"}
                onPress={() => router.push("/(tabs)/profile")}
                backgroundColor="#000000"
              />
            </View>
          ) : null}

          {state.currentSlide === 6 ? (
            <ScrollView>
              <View style={styles.artistGrid}>
                {state.topArtists.map((artist, index) => (
                  <Pressable
                    style={styles.artistContainer}
                    key={index}
                    onPress={(event) => {
                      event.preventDefault();
                      dispatch({
                        type: "SET_TOP_ARTISTS",
                        topArtists: state.topArtists.map((a, i) =>
                          i === index ? { ...a, selected: !a.selected } : a
                        ),
                      });
                    }}
                  >
                    <ArtistBubble artist={artist} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : null}

          {state.currentSlide === 7 ? (
            <ScrollView style={styles.idk}>
              <View style={styles.trackGrid}>
                {state.topTracks.map((track, index) => (
                  <Pressable
                    style={styles.trackContainer}
                    key={index}
                    onPress={(event) => {
                      event.preventDefault();
                      dispatch({
                        type: "SET_TOP_TRACKS",
                        topTracks: state.topTracks.map((t, i) =>
                          i === index ? { ...t, selected: !t.selected } : t
                        ),
                      });
                    }}
                  >
                    <TrackBubble track={track} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : null}
          {state.currentSlide === 5 ? (
            <EnthusiasmSlider email={state.email} />
          ) : state.currentSlide === 4 ? (
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
          ) : state.currentSlide === 2 ? (
            <View>
              <TextInput
                style={[
                  styles.input,
                  (!state.inputValid || !state.passwordMatch) &&
                    state.tried && { borderColor: "#8b0000" },
                ]}
                placeholder="Enter Password"
                placeholderTextColor="#808080"
                secureTextEntry={!state.passwordVisible}
                value={state.password}
                onChangeText={(text) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "password",
                    value: text,
                  })
                }
                onBlur={() => {
                  dispatch({
                    type: "SET_PASSWORD_MATCH",
                    match: state.password === state.confirmPassword,
                  });
                  dispatch({
                    type: "SET_INPUT_VALID",
                    valid:
                      state.password === state.confirmPassword &&
                      state.password.length >= 8,
                  });
                }}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => dispatch({ type: "TOGGLE_PASSWORD_VISIBILITY" })}
              >
                <Ionicons
                  name={state.passwordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.input,
                  (!state.inputValid || !state.passwordMatch) &&
                    state.tried && { borderColor: "#8b0000" },
                ]}
                placeholder="Confirm Password"
                placeholderTextColor="#808080"
                secureTextEntry={!state.passwordVisible}
                value={state.confirmPassword}
                onChangeText={(text) => {
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "confirmPassword",
                    value: text,
                  });
                }}
                onBlur={() => {
                  dispatch({
                    type: "SET_PASSWORD_MATCH",
                    match: state.password === state.confirmPassword,
                  });
                  dispatch({
                    type: "SET_INPUT_VALID",
                    valid:
                      state.password === state.confirmPassword &&
                      state.password.length >= 8,
                  });
                }}
              />
            </View>
          ) : state.currentSlide < 4 ? (
            <TextInput
              style={[
                styles.input,
                !state.inputValid && state.tried && { borderColor: "#8b0000" },
              ]}
              placeholder={slides[state.currentSlide].placeholder}
              placeholderTextColor="#808080"
              autoComplete={state.currentSlide === 1 ? "email" : "off"}
              inputMode={state.currentSlide === 1 ? "email" : "text"}
              value={
                state.currentSlide === 0
                  ? state.name
                  : state.currentSlide === 1
                    ? state.email
                    : state.username
              }
              onChangeText={(text) => {
                dispatch({
                  type: "UPDATE_FIELD",
                  field:
                    state.currentSlide === 0
                      ? "name"
                      : state.currentSlide === 1
                        ? "email"
                        : "username",
                  value: text,
                });
                dispatch({ type: "SET_INPUT_VALID", valid: text.length > 0 });
              }}
            />
          ) : null}
          <View style={styles.stickyContainer}>
            {state.currentSlide < 8 ? (
              <CustomButton
                text={"Continue"}
                onPress={handleNext}
                backgroundColor="#000000"
              />
            ) : null}
            <ProgressBar
              progress1={progressBars[0]}
              progress2={progressBars[1]}
              progress3={progressBars[2]}
              progress4={progressBars[3]}
              progress5={progressBars[4]}
              currentSlide={state.currentSlide}
              handleSlideChange={handleNext}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#FFFFFF" },
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
    top: 100,
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
