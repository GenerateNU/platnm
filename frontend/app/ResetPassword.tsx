import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import axios from "axios";
import OnboardButton from "@/components/onboarding/OnboardButton"; // Adjust the import path as necessary
import { useRouter } from "expo-router";
import OnboardingHeader from "@/components/onboarding/Header";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const ResetPassword = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setMessage("");
    setLoading(true);

    // Validate inputs
    if (!currentPassword || !newPassword) {
      setMessage("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axios
        .post(`${BASE_URL}}/auth/platnm/resetpassword`, {
          currentPassword,
          newPassword,
        })
        .then((response) => {
          if (response.status === 200) {
            router.back();
          }
        });
    } catch (error) {
      setMessage("Invalid current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader title="Reset Password" subtitle="" />

      <Text style={styles.message}>{message}</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        placeholderTextColor="#aaa"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#aaa"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <View style={styles.button}>
        <OnboardButton
          text={loading ? "Resetting..." : "Continue"}
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
    color: "darkred",
    marginTop: 8,
    marginBottom: 20,
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

export default ResetPassword;
