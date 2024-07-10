// frontend/src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomeBanner from './components/WelcomeBanner';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/common/Layout';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomeBanner />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
