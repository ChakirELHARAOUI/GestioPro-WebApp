// src/components/common/Header.js
import React, { useState } from 'react';
import { Nav, Container, NavDropdown, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/AuthContext';
import { FaBars } from 'react-icons/fa'; // Assurez-vous d'installer react-icons

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <header className="welcome-header">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button onClick={toggleMenu} className="menu-button me-2">
              <FaBars />
            </button>
            <img src={logo} alt="GestioPro Logo" className="logo me-2" />
            <h1 className="h4 mb-0">GestioPro</h1>
          </div>
          <Nav className="ms-auto">
            <NavDropdown title={user.username} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">Profil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Déconnexion</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </div>
      </Container>

      <Offcanvas show={showMenu} onHide={toggleMenu} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/dashboard" onClick={toggleMenu}>Tableau de bord</Nav.Link>
            <Nav.Link as={Link} to="/user-management" onClick={toggleMenu}>Gestion des utilisateurs</Nav.Link>
            <Nav.Link as={Link} to="/product-management" onClick={toggleMenu}>Gestion des produits</Nav.Link>
            <Nav.Link as={Link} to="/order-management" onClick={toggleMenu}>Gestion des commandes</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Header;
