import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const VendeurPage = () => {
  return (
    <Container>
      <h1 className="my-4">Espace Vendeur</h1>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Mes ventes du jour</Card.Title>
              <Card.Text>
                Afficher ici un résumé des ventes du jour.
              </Card.Text>
              <Button variant="primary">Voir détails</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Objectifs</Card.Title>
              <Card.Text>
                Afficher ici les objectifs de vente et leur progression.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Nouvelle vente</Card.Title>
              <Card.Text>
                Formulaire pour enregistrer une nouvelle vente ici...
              </Card.Text>
              <Button variant="success">Enregistrer une vente</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VendeurPage;
