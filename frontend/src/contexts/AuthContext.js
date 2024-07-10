// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('AuthContext | decodedToken = ', decodedToken);
        setUser({
          id_User: decodedToken.id,
          username : decodedToken.username,
          sector : decodedToken.sector,
          role: decodedToken.role
        });
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false)
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
