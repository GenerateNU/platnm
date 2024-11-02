import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
} from "react";

interface AuthProviderProps {
  username: string;
  accessToken: string;
  sessionToken: string;
  updateAccessToken: (token: string) => void;
  updateUsername: (username: string) => void;
  updateSession: (session: string) => void;
}

const AuthContext = createContext<AuthProviderProps>({
  username: "",
  accessToken: "",
  sessionToken: "",
  updateAccessToken: (token : string) => {},
  updateUsername: (username : string) => {},
  updateSession: (session : string) => {},
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [username, setUsername] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [sessionToken, setSessionToken] = useState("sessionStartsLikeThis");

  const updateAccessToken = (token: string) => {
    setAccessToken(token);
  };

  const updateUsername = (username: string) => {
    setUsername(username);
  };

  const updateSession = (session: string) => {
    console.log("session is..." + session); // Check if this is printed
    setSessionToken(session);
    console.log("Updated sessionToken: " + sessionToken); // Check updated state
  }

  return (
    <AuthContext.Provider
      value={{ username, accessToken, sessionToken, updateAccessToken, updateUsername, updateSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
