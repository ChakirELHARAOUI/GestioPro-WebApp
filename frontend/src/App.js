// frontend/src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomeBanner from './components/WelcomeBanner';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import UserManagement from './components/user-management/UserManagement';
import ProductBDDManagement from './components/catalogue-produit/CatalogueProduit';
import OrderManagement from './components/gestion-commandes/CommandeGlobaleList';
import Profile from './components/profile/Profile';
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
        <Route path="/user-management" element={
          <PrivateRoute>
            <Layout>
              <UserManagement />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/product-management" element={
          <PrivateRoute>
            <Layout>
              <ProductBDDManagement />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/order-management" element={
          <PrivateRoute>
            <Layout>
              <OrderManagement />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
