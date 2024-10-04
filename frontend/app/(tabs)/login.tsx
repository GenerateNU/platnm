import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { User, createClient } from "@supabase/supabase-js";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SUPABASE_URL, SUPABASE_ANON_KEY} from "@env";
import { Text } from "react-native";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function Login() {
  // Contains the user received from Supabase
  const [user, setUser] = useState<User>();

//   useEffect(() => {
//     // Whenever the auth state changes, we receive an event and a session object.
//     // Save the user from the session object to the state.
//     supabase.auth.onAuthStateChange((event, session) => {
//       if (event === "SIGNED_IN") {
//         setUser(session?.user);
//       }
//     });
//   }, []);

  return <LoggedOut />;
}

function LoggedIn() {
  // Store data that we get from the backend
  const [ourSecretData, setOutSecretData] = useState();

  // Perform a request to the backend (with a protected route) to get the secret data
//   useEffect(() => {
//     fetch("http://localhost:3000/secret", {
//       method: "POST",
//       headers: {
//         // This is the token that we get from Supabase.
//         Authorization: getToken(),
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => setOutSecretData(data));
//   }, []);

  // This removes the token from local storage and reloads the page
  const handleSignOut = () => {
    supabase.auth.signOut().then(() => {
      window.location.reload();
    });
  };

  return (
    <>
      <div>{JSON.stringify(ourSecretData)}</div>
      <button onClick={handleSignOut}>Sign out</button>
    </>
  );
}

function LoggedOut() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
      }}
      providers={[]}
      theme="dark"
      redirectTo="/"
      showLinks
    >
        <Text>Some text string</Text>
    </Auth>
  );
}

// This function gets the token from local storage.
// Supabase stores the token in local storage so we can access it from there.
// const getToken = () => {
//   const storageKey = `sb-${supabaseProjectId}-auth-token`;
//   const sessionDataString = localStorage.getItem(storageKey);
//   const sessionData = JSON.parse(sessionDataString || "null");
//   const token = sessionData?.access_token;

//   return token;
// };

export default Login;