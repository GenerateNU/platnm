import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
} from "react";

interface AuthProviderProps {
  username: string;
  userId: string;
  accessToken: string;
  sessionToken: string;
  updateAccessToken: (token: string) => void;
  updateUsername: (username: string) => void;
  updateSession: (session: string) => void;
  updateUserId: (userId: string) => void;
}

const AuthContext = createContext<AuthProviderProps>({
  username: "",
  userId: "",
  accessToken: "",
  sessionToken: "",
  updateAccessToken: (token: string) => {},
  updateUsername: (username: string) => {},
  updateSession: (session: string) => {},
  updateUserId: (userId: string) => {},
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [username, setUsername] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [sessionToken, setSessionToken] = useState("sessionStartsLikeThis");
  const [userId, setUserId] = useState("");

  const updateAccessToken = (token: string) => {
    setAccessToken(token);
  };

  const updateUsername = (username: string) => {
    setUsername(username);
  };

  const updateSession = (session: string) => {
    setSessionToken(session);
  };

  const updateUserId = (userId: string) => {
    setUserId(userId);
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        userId,
        accessToken,
        sessionToken,
        updateAccessToken,
        updateUsername,
        updateSession,
        updateUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
