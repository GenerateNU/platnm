import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import CustomButton from "@/components/onboarding/OnboardButton";
import Header from "@/components/onboarding/Header";
import { useSharedValue, withTiming } from "react-native-reanimated";
import ProgressBar from "@/components/onboarding/ProgressBar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";

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
];

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const OnboardingCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0); // Start from slide 0
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [inputValid, setInputValid] = useState(false);
  const [tried, setTried] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const progressBar1 = useSharedValue(0);
  const progressBar2 = useSharedValue(0);

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
      { duration: 500 },
    );
  };

  const handleSignUp = async () => {
    setLoading(true);

    await axios
      .post(`${BASE_URL}/users`, {
        DisplayName: name,
        email: email,
        password: password,
        username: username,
      })
      .then((res) => {
        if (res.data.error) {
          alert("Error" + res.data.error);
          return;
        }
        alert("Success \n You've got an account!");
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        alert("Login Error" + error.message);
      });
    setLoading(false);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      if (inputValid || (currentSlide === 2 && passwordMatch)) {
        handleSlideChange(currentSlide + 1);
        setInputValid(false);
      } else {
        setTried(true);
      }
    } else {
      handleSignUp;
      router.push("/");
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={slides[currentSlide].title}
        subtitle={slides[currentSlide].question}
      />

      {currentSlide === 2 ? (
        <View>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
          </TouchableWithoutFeedback>
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
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!passwordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={
                password.isWellFormed()
                  ? () => {
                      setInputValid(true);
                      setTried(false);
                    }
                  : () => setTried(true)
              }
            />
          </TouchableWithoutFeedback>
          {!passwordMatch && (
            <Text style={styles.errorText}>Passwords do not match.</Text>
          )}
        </View>
      ) : currentSlide === 4 ? (
        <View style={styles.buttonGroup}>
          <CustomButton
            text={"Log in with Spotify"}
            onPress={() => alert("Open with Spotify")}
            backgroundColor="#1DB954"
          />
          <CustomButton
            text={"Log in with Apple"}
            onPress={() => alert("Open with Apple Music")}
          />
        </View>
      ) : (
        <View>
          {tried && !inputValid && (
            <Text style={[styles.errorText, { bottom: 156 }]}>
              Is this correct?
            </Text>
          )}
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <TextInput
              style={[
                styles.input,
                !inputValid && tried && { borderColor: "#8b0000" },
              ]}
              keyboardType={currentSlide === 1 ? "email-address" : "default"}
              placeholder={slides[currentSlide].placeholder}
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
                } else if (currentSlide === 0 || currentSlide === 3) {
                  setInputValid(true);
                }
                setTried(false);
              }}
            />
          </TouchableWithoutFeedback>
        </View>
      )}

      <View style={styles.stickyContainer}>
        <CustomButton
          text={loading ? "Loading" : "Continue"}
          onPress={handleNext}
        />
        <ProgressBar
          progress1={progressBar1}
          progress2={progressBar2}
          currentSlide={currentSlide}
          handleSlideChange={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 230,
    marginHorizontal: 22,
    gap: 65,
    color: "white",
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
});

export default OnboardingCarousel;
