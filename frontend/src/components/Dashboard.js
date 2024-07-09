import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <Container fluid className="dashboard-container">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title as="h1" className="mb-4">Tableau de bord</Card.Title>
              <Card.Text>
                Bienvenue sur le tableau de bord. Utilisez le menu pour naviguer entre les différentes sections.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Ajoutez des widgets ou des graphiques ici */}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
