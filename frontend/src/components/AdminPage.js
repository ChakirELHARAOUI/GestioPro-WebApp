import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const AdminPage = () => {
  return (
    <Container>
      <h1 className="my-4">Administration</h1>
      <Row>
        <Col md={6}>
          <h2>Gestion des utilisateurs</h2>
          <Button variant="primary" className="mb-3">Ajouter un utilisateur</Button>
          <p>Liste des utilisateurs ici...</p>
        </Col>
        <Col md={6}>
          <h2>Paramètres du système</h2>
          <Button variant="secondary" className="mb-3">Modifier les paramètres</Button>
          <p>Paramètres actuels ici...</p>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
