import { createContext, useContext, useState, useEffect } from "react";
import { fetchMe } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("hrms_token");
    if (token) {
      fetchMe()
        .then((res) => setUser(res.data.user))
        .catch(() => localStorage.removeItem("hrms_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("hrms_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("hrms_token");
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await fetchMe();
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
