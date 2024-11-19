// userContext.js
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(() => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      }
      return null;
    });
  
    const setUser = (user) => {
      setUserData(user);
      localStorage.setItem("user", JSON.stringify(user));
    };
  
    const clearUser = () => {
      setUserData(null);
      localStorage.removeItem("user");
    };
  
    return (
      <UserContext.Provider value={{ userData, setUser, clearUser }}>
        {children}
      </UserContext.Provider>
    );
  };
  

export const useUser = () => useContext(UserContext);
