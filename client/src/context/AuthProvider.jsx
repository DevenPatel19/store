// src/context/AuthProvider.js
import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { AuthContext } from "./AuthContext"; // ✅ Import the context


// Load base API URL from environment or fallback to localhost
const VITE_API_URL =  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios.get("/api/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    setUser(res.data);
  };

  const register = async (username, email, password) => {
    const res = await axios.post("/api/auth/register", { username, email, password });
    localStorage.setItem("token", res.data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
