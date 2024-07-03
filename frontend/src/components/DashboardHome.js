import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const DashboardHome = () => {
  return (
    <Container>
      <h1 className="my-4">Tableau de bord</h1>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Résumé des ventes</Card.Title>
              <Card.Text>
                Afficher ici un résumé des ventes récentes.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Statistiques</Card.Title>
              <Card.Text>
                Afficher ici des statistiques générales.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Notifications</Card.Title>
              <Card.Text>
                Afficher ici les notifications récentes.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardHome;
