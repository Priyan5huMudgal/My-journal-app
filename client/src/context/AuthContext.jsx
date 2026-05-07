import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("journal_user");
    const savedToken = localStorage.getItem("journal_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (payload) => {
    const response = await api.post("/auth/login", payload);
    const { token, user } = response.data;
    localStorage.setItem("journal_token", token);
    localStorage.setItem("journal_user", JSON.stringify(user));
    setUser(user);
    navigate("/journal");
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    const { token, user } = response.data;
    localStorage.setItem("journal_token", token);
    localStorage.setItem("journal_user", JSON.stringify(user));
    setUser(user);
    navigate("/journal");
  };

  const updateProfile = async (payload) => {
    const response = await api.put("/auth/profile", payload);
    const { user: updatedUser } = response.data;
    localStorage.setItem("journal_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const changePassword = async (payload) => {
    await api.put("/auth/change-password", payload);
  };

  const logout = () => {
    localStorage.removeItem("journal_token");
    localStorage.removeItem("journal_user");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
