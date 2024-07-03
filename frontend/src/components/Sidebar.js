import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggle, userRole }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
        </Nav.Item>
        {userRole === 'admin' && (
          <>
            <Nav.Item>
              <Nav.Link as={Link} to="/admin">Admin Page</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/users">Gestion des utilisateurs</Nav.Link>
            </Nav.Item>
          </>
        )}
        {(userRole === 'admin' || userRole === 'manager') && (
          <Nav.Item>
            <Nav.Link as={Link} to="/reports">Rapports</Nav.Link>
          </Nav.Item>
        )}
        {userRole === 'vendeur' && (
          <Nav.Item>
            <Nav.Link as={Link} to="/sales">Ventes</Nav.Link>
          </Nav.Item>
        )}
        {/* Ajoutez d'autres éléments de menu en fonction des rôles */}
      </Nav>
    </div>
  );
};

export default Sidebar;
