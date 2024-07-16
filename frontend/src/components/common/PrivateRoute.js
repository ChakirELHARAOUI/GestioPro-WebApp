import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
  const { user, loading, setUser } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setUser(null);
      } else if (!user) {
        setUser({
          id_User: decodedToken.id,
          username: decodedToken.username,
          sector: decodedToken.sector,
          role: decodedToken.role
        });
      }
    } catch (error) {
      console.error("Erreur de décodage du token:", error);
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [user, setUser]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
