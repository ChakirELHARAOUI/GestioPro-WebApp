// frontend/src/components/dashboard/Dashboard.js

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Container fluid className="dashboard-container">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title as="h1" className="mb-4">Tableau de bord</Card.Title>
              <Card.Text>
                Bienvenue sur le tableau de bord, {user.username}.
                {user.role === 1 ? " Vous avez accès aux fonctionnalités de manager." : ""}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Ajoutez des widgets ou des graphiques ici */}
          {/* Vous pouvez conditionner l'affichage de certains éléments en fonction du rôle */}
          {user.role === 1 && (
            <Card>
              <Card.Body>
                <Card.Title>Fonctionnalités de Manager</Card.Title>
                {/* Ajoutez ici les fonctionnalités spécifiques aux managers */}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
