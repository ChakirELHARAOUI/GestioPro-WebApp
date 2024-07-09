// src/components/Layout.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Container fluid className="px-0">
      <Header />
      <Row className="flex-xl-nowrap">
        <Col xs={12} md={3} lg={2} className="sidebar">
          <Sidebar />
        </Col>
        <Col xs={12} md={9} lg={10} className="main-content">
          {children}
        </Col>
      </Row>
      <Footer />
    </Container>
  );
};

export default Layout;
