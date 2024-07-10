// src/components/common/Header.js
import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="header">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">VotreApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/user-management">Gestion des utilisateurs</Nav.Link>
            <Nav.Link as={Link} to="/product-management">Gestion des produits</Nav.Link>
            <Nav.Link as={Link} to="/order-management">Gestion des commandes</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <NavDropdown title={user.username} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">Profil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Déconnexion</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
