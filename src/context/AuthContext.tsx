import React, { createContext, useCallback, useState } from 'react';
import api from '../services/api';

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
}

interface AuthState {
  token: string;
  user: object;
}
interface SignInCredentials {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarberApp:token');
    const user = localStorage.getItem('@GoBarberApp:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post('/sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@GoBarberApp:token', token);
    localStorage.setItem('@GoBarberApp:user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
