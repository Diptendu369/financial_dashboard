import { createContext, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));
  const [user, setUser] = useState(token ? jwtDecode(token) : null);

  const login = (newToken, newRefreshToken) => {
    localStorage.setItem("token", newToken);
    if (newRefreshToken) {
      localStorage.setItem("refresh_token", newRefreshToken);
      setRefreshToken(newRefreshToken);
    }
    setToken(newToken);
    setUser(jwtDecode(newToken));
  };

  const logout = async () => {
    const storedRefreshToken = localStorage.getItem("refresh_token");
    if (storedRefreshToken) {
      try {
        await api.post("/auth/logout", { refresh_token: storedRefreshToken });
      } catch (_) {
        // Ignore logout API errors and clear local session anyway.
      }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, refreshToken, user, login, logout }),
    [token, refreshToken, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
