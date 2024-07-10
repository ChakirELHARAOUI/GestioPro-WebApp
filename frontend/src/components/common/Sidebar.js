// src/components/common/Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ userRole }) => {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/dashboard">Tableau de bord</Link></li>
        {userRole === 1 && (
          <>
            <li><Link to="/user-management">Gestion des utilisateurs</Link></li>
            <li><Link to="/reports">Rapports</Link></li>
            {/* Ajoutez d'autres liens spécifiques aux managers */}
          </>
        )}
        {/* Ajoutez d'autres liens communs à tous les utilisateurs */}
      </ul>
    </nav>
  );
};

export default Sidebar;
