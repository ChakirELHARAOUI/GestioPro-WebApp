import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from './UserManagement';
import './ManagerPage.css';

const ManagerPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title as="h1" className="mb-4">Tableau de bord Manager</Card.Title>
              <Card.Text>
                Bienvenue, {user.username}. Gérez vos utilisateurs ci-dessous.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <UserManagement userRole={user.role} userId={user.id} />
        </Col>
      </Row>
    </Container>
  );
};

export default ManagerPage;
