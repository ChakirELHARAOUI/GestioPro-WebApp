import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import Login from './components/Login';
import ManagerPage from './components/ManagerPage';
import VendeurPage from './components/VendeurPage';
import WelcomeBanner from './components/WelcomeBanner';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<WelcomeBanner />} />
              <Route path="/login" element={<Login />} />
              <Route path="/manager" element={<PrivateRoute requiredRole={1}><ManagerPage /></PrivateRoute>} />
              <Route path="/vendeur" element={<PrivateRoute requiredRole={0}><VendeurPage /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
