import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomeBanner.css';
import logo from '../assets/logo.png';

const WelcomeBanner = () => {
  return (
    <div className="welcome-banner d-flex flex-column min-vh-100">
      <header className="bg-light py-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img src={logo} alt="GestioPro Logo" className="logo me-2" style={{ height: '40px' }} />
              <h1 className="h4 mb-0">GestioPro</h1>
            </div>
            <Link to="/login" className="btn btn-outline-primary">Connexion</Link>
          </div>
        </div>
      </header>
      <main className="flex-grow-1 d-flex align-items-center">
        <div className="container text-center">
          <h2 className="mb-4">Bienvenue sur votre application de gestion d'entreprise</h2>
          <p className="mb-4">Optimisez la gestion de votre entreprise avec notre solution complète et intuitive.</p>
          <Link to="/login" className="btn btn-primary btn-lg">Commencer maintenant</Link>
        </div>
      </main>
    </div>
  );
};

export default WelcomeBanner; 
