import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
  const { user, loading, setUser } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    setUser(null);
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      setUser(null);
      return <Navigate to="/login" replace />;
    }

    if (!user) {
      setUser({
        id_User: decodedToken.id,
        username: decodedToken.username,
        sector: decodedToken.sector,
        role: decodedToken.role
      });
    }

    return children ? children : <Outlet />;
  } catch (error) {
    console.error("Erreur de décodage du token:", error);
    localStorage.removeItem('token');
    setUser(null);
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
