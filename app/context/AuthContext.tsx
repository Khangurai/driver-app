import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  username: string;
  [key: string]: any;
};

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  session: { user: User } | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  session: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ user: User } | null>(null);

  useEffect(() => {
    // Simulate checking persisted session (AsyncStorage, etc.)
    setLoading(false);
  }, []);

  const login = (user: User) => {
    setSession({ user });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setSession(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
