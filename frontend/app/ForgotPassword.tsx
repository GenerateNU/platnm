import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import OnboardingHeader from "@/components/onboarding/Header";
import OnboardButton from "@/components/onboarding/OnboardButton";
import { router } from "expo-router";

const ForgotPassword: React.FC = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/platnm/forgot`, {
        email: email,
      });
      if (response.status === 200) {
        setMessage("Email sent successfully!");
        Alert.alert("Success", "Email sent successfully!");
        router.push("../ResetPassword");
      } else {
        setMessage("Failed to send email. Please try again.");
        Alert.alert("Error", "Failed to send email. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader
        title="Forgot Password"
        subtitle="Let's get you back in."
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <OnboardButton
        backgroundColor="#000"
        text="Submit"
        onPress={handleSubmit}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    gap: 30,
  },

  input: {
    height: 55,
    width: 346,
    borderColor: "#F1F1F1",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#F1F1F1",
    color: "000",
  },
  message: {
    marginTop: 16,
    textAlign: "center",
    color: "red",
  },
});

export default ForgotPassword;
