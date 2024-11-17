import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import axios from "axios";
import OnboardButton from "@/components/onboarding/OnboardButton"; // Adjust the import path as necessary
import { useRouter } from "expo-router";
import OnboardingHeader from "@/components/onboarding/Header";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const handleResetPassword = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/platnm/resetpassword`,
        {
          email: email,
        }
      );

      if (response.data.error) {
        Alert.alert("Error", response.data.error);
        return;
      }
      setMessage("Success! Check your email.");
      router.push("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader title="Reset Password" subtitle="" />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.message}>{message}</Text>

      <View style={styles.button}>
        <OnboardButton
          text={loading ? "Sending..." : "Continue"}
          onPress={handleResetPassword}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
    textAlign: "left",
    fontFamily: "SF Pro Display",
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
  },
  message: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#000000",
  },
  button: {
    height: 55,
    width: 346,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: "#000000",
    justifyContent: "center",
  },
});

export default ForgotPassword;
