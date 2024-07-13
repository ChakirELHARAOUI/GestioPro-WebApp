// src/components/common/Footer.js
import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <p>&copy; 2024 GestioPro. Tous droits réservés.</p>
      </Container>
    </footer>
  );
};

export default Footer;
