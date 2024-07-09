import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from './UserManagement';

const ManagerPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Page Manager</h1>
      <Button variant="primary">Un bouton</Button>
      <UserManagement userRole={user.role} userId={user.id} />
    </div>
  );
};

export default ManagerPage;
