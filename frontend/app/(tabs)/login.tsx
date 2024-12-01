import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  View,
  Text,
  Alert,
  Button,
  TextInput,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from "react-native";
import axios from "axios";
import { useAuthContext } from "@/components/AuthProvider";
import { router } from "expo-router";
import { access } from "fs";

export default function Login() {
  const { sessionToken, accessToken, updateAccessToken, updateSession, updateUserId, updateUsername } =
    useAuthContext();
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase URL or anon key");
  }
  // const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);

    await axios
      .post(`${BASE_URL}/auth/platnm/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.error) {
          Alert.alert("Error", res.data.error);
          return;
        }
        updateAccessToken(res.data.access_token);
        const sessionHeader = res.headers["x-session"];
        updateSession(sessionHeader);
        updateUserId(res.data.user.id);
        updateUsername(res.data.user.username); //TODO: Change according depending on how username is added to backend response
        router.push("/(tabs)/profile");
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        Alert.alert("Login Error", error.message);
      });
    setLoading(false);
  };

  const forgotUsernamePassword = () => {
    router.push("../ResetPassword");
  };

  const handleSignUpPress = () => {
    router.push("/onboarding/signup");
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.button}>
          <Button
            title={loading ? "Logging in..." : "Login"}
            onPress={handleSignIn}
            disabled={loading}
            color={"#fff"}
          />
        </View>

        <TouchableOpacity onPress={forgotUsernamePassword}>
          <Text style={styles.note}>Forgot username or password</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpNote}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUpPress}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff", // Dark theme background
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
    textAlign: "left",
    marginBottom: 20,
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
  button: {
    height: 55,
    width: 346,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: "#000000",
    justifyContent: "center",
  },
  note: {
    textAlign: "center",
    color: "#7C7C7C",
    marginTop: 20,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signUpNote: {
    textAlign: "center", // Align text to the center
    color: "#7C7C7C",
  },
  signUpText: {
    color: "#000000",
  },
  secretText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
});
