// src/components/common/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Container } from 'react-bootstrap';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div className="layout">
      <Header />
      <Container fluid className="main-content">
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;
