import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("token") || null
  );
  const [user, setUser] = useState(null);

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem("token", token); // optional
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
