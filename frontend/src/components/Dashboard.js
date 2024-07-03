import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { getRoleString } from '../utils';
//import './Dashboard.css';

// Importez vos composants de page
import AdminPage from './AdminPage';
import ManagerPage from './ManagerPage';
import VendeurPage from './VendeurPage';
import DashboardHome from './DashboardHome';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const roleNumber = parseInt(localStorage.getItem('userRole'));
    const role = getRoleString(roleNumber);
    setUserRole(role);

    // Redirection basée sur le rôle
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'manager') {
      navigate('/manager');
    } else if (role === 'vendeur') {
      navigate('/vendeur');
    } else {
      // Si le rôle n'est pas reconnu, redirigez vers la page d'accueil ou une page d'erreur
      navigate('/');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard d-flex">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} userRole={userRole} />
      <div className={`content-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Container fluid>
          <Row>
            <Col>
              <button className="btn btn-primary d-md-none mb-3" onClick={toggleSidebar}>
                Toggle Sidebar
              </button>
              <MainContent>
                <Routes>
                  <Route path="/" element={<DashboardHome />} />
                  {userRole === 'admin' && <Route path="/admin" element={<AdminPage />} />}
                  {userRole === 'manager' && <Route path="/manager" element={<ManagerPage />} />}
                  {userRole === 'vendeur' && <Route path="/vendeur" element={<VendeurPage />} />}
                  {/* Ajoutez d'autres routes selon vos besoins */}
                </Routes>
              </MainContent>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
