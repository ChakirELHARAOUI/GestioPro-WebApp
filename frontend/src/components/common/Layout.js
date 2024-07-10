// src/components/common/Layout.js

import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  console.log("Layout | user = ",user)

  return (
    <div className="layout">
      <Sidebar userRole={user.role} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
