import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { User, createClient } from "@supabase/supabase-js";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_ID } from "@env";
import { View, Text, Alert, Button, TextInput, StyleSheet } from "react-native";
import axios from "axios";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Login() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("Signed in");
        console.log(session?.user);
        setUser(session?.user);
      }
    });
  }, []);

  return user ? <LoggedIn /> : <LoggedOut />;
}

function LoggedIn() {
  const [ourSecretData, setOutSecretData] = useState("not secret right now");

  // Perform a request to the backend (with a protected route) to get the secret data
  useEffect(() => {
    console.log('useEffect called');
    axios.post("http://localhost:8080/secret")
    .then((res) => {
      console.log('res:', res.data.secret);
      setOutSecretData(res.data.secret);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
    console.log('fetch called');
  }, []);

  return (
    <View>
      <Text style={styles.secretText}>{ourSecretData}</Text>
    </View>
  );
}

const LoggedOut = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Sign-in function using Supabase
  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert('Login Error', error.message);
    } else {
      Alert.alert('Success', 'You are now signed in!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

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

      <Button
        title={loading ? 'Logging in...' : 'Log In'}
        onPress={handleSignIn}
        disabled={loading}
      />

      <Text style={styles.note}>Don't have an account? Sign up with Supabase!</Text>
    </View>
  );
};

  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',  // Dark theme background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#fff',  // Text color in dark mode
    backgroundColor: '#333',  // Dark input background
  },
  note: {
    textAlign: 'center',
    color: '#bbb',
    marginTop: 20,
  },
  secretText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
});