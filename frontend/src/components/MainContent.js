import React from 'react';
import { Container } from 'react-bootstrap';

const MainContent = ({ children }) => {
  return (
    <main className="main-content">
      <Container fluid>
        {children}
      </Container>
    </main>
  );
};

export default MainContent;
