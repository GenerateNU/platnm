import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, BASE_URL } from "@env";
import {
  View,
  Text,
  Alert,
  Button,
  TextInput,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useAuthContext } from "@/components/AuthProvider";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateAccessToken } = useAuthContext();

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
        Alert.alert("Success", "You are now signed in!");
        updateAccessToken(res.data.token);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        Alert.alert("Login Error", error.message);
      });
    setLoading(false);
  };

  const forgotUsernamePassword = () => {
    console.log("Forgot username or password");
  };

  const handleSignUpPress = () => {
    console.log("Sign up pressed");
  };

  return (
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
