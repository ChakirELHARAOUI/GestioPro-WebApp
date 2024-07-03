import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ManagerPage = () => {
  return (
    <Container>
      <h1 className="my-4">Gestion</h1>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Rapports de vente</Card.Title>
              <Card.Text>
                Afficher ici un résumé des rapports de vente.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Performance de l'équipe</Card.Title>
              <Card.Text>
                Afficher ici les statistiques de performance de l'équipe.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Objectifs du mois</Card.Title>
              <Card.Text>
                Afficher ici les objectifs du mois et leur progression.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagerPage;
