import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import './Sidebar.css';

const Sidebar = () => {
  return (
    <Nav className="col-md-12 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky"></div>
      <Nav.Item>
        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/users">Gestion des Utilisateurs</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/products">Gestion des Produits</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/orders">Gestion des Commandes</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/stock">Gestion des Stocks</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/profile">Mon Profil</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;
