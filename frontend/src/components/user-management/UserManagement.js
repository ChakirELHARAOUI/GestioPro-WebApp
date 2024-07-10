import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Alert} from 'react-bootstrap';
import api from '../../api/axios';
import './UserManagement.css';


const UserManagement = ({ userRole, userId }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState('');

  console.log('UserManagement | userRole = ', userRole);
  console.log('UserManagement | userId = ', userId);
  console.log('UserManagement | Users = ', users);

  const fetchUsers = useCallback(async () => {
    try {
      let response;
      if (userRole !== 0) {
        response = await api.get('/api/users/getUsers');
      }
      setUsers(Array.isArray(response.data.users) ? response.data.users : [response.data.users]);
    } catch (err) {
      setError('Erreur lors de la récupération des utilisateurs');
    }
  }, [userRole]);

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

  const handleDelete = async (id_User) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await api.delete(`/api/users/deleteUser/${id_User}`);
        fetchUsers();
      } catch (err) {
        setError('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser.id_User) {
        await api.put(`/api/users/updateUser/${currentUser.id_User}`, currentUser);
      } else {
        await api.post('/api/users/addUser', currentUser);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de l'utilisateur:", err);
      setError(`Erreur lors de la sauvegarde de l'utilisateur: ${err.message}`);
    }
  };
  

  const getRoleName = (roleInt) => {
    return roleInt === 1 ? 'Manager' : 'Vendeur';
  };

  return (
    <div className="user-management-container">
      <h2 className="user-management-title">Gestion des Utilisateurs</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {userRole !== 0 && (
        <Button variant="primary" onClick={handleCreate} className="create-user-btn">
          <i className="bi bi-plus-circle me-2"></i>Créer un nouvel utilisateur
        </Button>
      )}
      <div className="table-responsive">
        <Table hover bordered className="user-table">
          <thead>
            <tr>
              <th>Nom d'utilisateur</th>
              <th>Rôle</th>
              {userRole !== 0 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id_User}>
                <td>{user.username}</td>
                <td>
                  <span className={`role-badge ${user.role === 1 ? 'role-manager' : 'role-vendeur'}`}>
                    {getRoleName(user.role)}
                  </span>
                </td>
                {userRole !== 0 && (
                  <td className="user-actions">
                    <Button variant="outline-info" size="sm" onClick={() => handleEdit(user)}>
                      <i className="bi bi-pencil"></i> Éditer
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id_User)}>
                      <i className="bi bi-trash"></i> Supprimer
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
  
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser.id_User ? 'Éditer' : 'Créer'} un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.username || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                value={currentUser.role || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, role: parseInt(e.target.value) })}
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="1">Manager</option>
                <option value="0">Vendeur</option>
              </Form.Select>
            </Form.Group>
            {!currentUser.id_User && (
              <Form.Group className="mb-3">
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