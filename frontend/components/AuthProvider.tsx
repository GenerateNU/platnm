import React, {createContext, useState, useContext, PropsWithChildren} from 'react';

interface AuthProviderProps {
    username: string;
    accessToken: string;
    updateAccessToken: (token: string) => void;
    updateUsername: (username: string) => void;
}

const AuthContext = createContext<AuthProviderProps>({
    username: '',
    accessToken: '',
    updateAccessToken: () => {},
    updateUsername: () => {},
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [username, setUsername] = useState('');
    const [accessToken, setAccessToken] = useState('');

    const updateAccessToken = (token: string) => {
        setAccessToken(token);
    };

    const updateUsername = (username: string) => {
        setUsername(username);
    };

    return (
        <AuthContext.Provider value={{ username, accessToken, updateAccessToken, updateUsername }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};