// frontend/src/components/UserManagement.js

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = ({ userRole, userId }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      let response;
      if (userRole === 1) {
        response = await axios.get('/api/users');
      } else {
        response = await axios.get(`/api/users/${userId}`);
      }
      setUsers(userRole === 1 ? response.data : [response.data]);
    } catch (err) {
      setError('Erreur lors de la récupération des utilisateurs');
    }
  }, [userRole, userId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = () => {
    setCurrentUser({});
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        setError('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser.id) {
        await axios.put(`/api/users/${currentUser.id}`, currentUser);
      } else {
        await axios.post('/api/users', currentUser);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError('Erreur lors de la sauvegarde de l\'utilisateur');
    }
  };

  const getRoleName = (roleInt) => {
    return roleInt === 1 ? 'Manager' : 'Vendeur';
  };

  return (
    <div className="container mt-4">
      <h2>Gestion des Utilisateurs</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {userRole === 1 && (
        <Button variant="primary" onClick={handleCreate} className="mb-3">
          Créer un nouvel utilisateur
        </Button>
      )}
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Nom d'utilisateur</th>
            <th>Rôle</th>
            {userRole === 1 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{getRoleName(user.role)}</td>
              {userRole === 1 && (
                <td>
                  <Button variant="info" size="sm" onClick={() => handleEdit(user)} className="mr-2">
                    Éditer
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                    Supprimer
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser.id ? 'Éditer' : 'Créer'} un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.username || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rôle</Form.Label>
              <Form.Control
                as="select"
                value={currentUser.role || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, role: parseInt(e.target.value) })}
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="1">Manager</option>
                <option value="0">Vendeur</option>
              </Form.Control>
            </Form.Group>
            {!currentUser.id && (
              <Form.Group>
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                  required
                />
              </Form.Group>
            )}
            <Button variant="primary" type="submit">
              Sauvegarder
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagement;

