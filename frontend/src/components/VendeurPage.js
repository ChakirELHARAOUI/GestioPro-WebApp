import React from 'react';
import UserManagement from './UserManagement';
import { useAuth } from '../contexts/AuthContext';

const VendeurPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Page Vendeur</h1>
      <UserManagement userRole={user.role} userId={user.id} />
    </div>
  );
};

export default VendeurPage;
