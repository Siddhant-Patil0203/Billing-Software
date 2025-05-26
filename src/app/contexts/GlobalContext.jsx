import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Corrected import for App Router

const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // For initial auth check
  const router = useRouter();

  useEffect(() => {
    // Check for token in localStorage on initial load
    const storedToken = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        // Optional: Add token validation logic here (e.g., check expiry)
        // For simplicity, we'll assume the token is valid if present
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    localStorage.setItem("jwtToken", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    setIsAuthenticated(true);
    router.push('/invoices'); // Redirect to a protected page
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login'); // Redirect to login page
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        // setUser is still here if needed for direct manipulation, but login/logout are preferred
        setUser 
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};