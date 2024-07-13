import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Alert, OverlayTrigger, Tooltip, Container, Row, Col } from 'react-bootstrap';
import api from '../../api/axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './UserManagement.css';



const UserManagement = ({ userRole, userId }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState('');


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
    setCurrentUser({
      ...user,
      role: parseInt(user.role)
    });
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
      const userToSave = {
        ...currentUser,
        role: parseInt(currentUser.role)
      };
      if (currentUser.id_User) {
        await api.put(`/api/users/updateUser/${currentUser.id_User}`, userToSave);
      } else {
        await api.post('/api/users/addUser', userToSave);
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
    <Container fluid className="user-management-container py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <h2 className="user-management-title">Gestion des Utilisateurs</h2>
        </Col>
      </Row>
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      {userRole !== 0 && (
        <Row className="mb-4">
          <Col>
            <Button variant="primary" onClick={handleCreate} className="create-user-btn">
              <FaPlus className="me-2" />Créer un nouvel utilisateur
            </Button>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <div className="table-responsive">
            <Table hover className="user-table">
              <thead>
                <tr>
                  <th>Nom d'utilisateur</th>
                  <th>Secteur</th>
                  <th>Rôle</th>
                  {userRole !== 0 && <th className="text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id_User}>
                    <td>{user.username}</td>
                    <td>{user.sector}</td>
                    <td>
                      <span className={`role-badge ${user.role === 1 ? 'role-manager' : 'role-vendeur'}`}>
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    {userRole !== 0 && (
                      <td>
                        <div className="d-flex justify-content-center">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Éditer</Tooltip>}>
                            <Button variant="light" size="sm" onClick={() => handleEdit(user)} className="me-2 action-btn">
                              <FaEdit />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Supprimer</Tooltip>}>
                            <Button variant="light" size="sm" onClick={() => handleDelete(user.id_User)} className="action-btn">
                              <FaTrash />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
  
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser.id_User ? 'Modifier' : 'Créer'} un utilisateur</Modal.Title>
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
              <Form.Label>Secteur</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.sector || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, sector: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                value={currentUser.role !== undefined ? currentUser.role.toString() : ''}
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
    </Container>
  );
};

export default UserManagement;