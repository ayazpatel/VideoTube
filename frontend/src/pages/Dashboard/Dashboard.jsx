import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - VideoTube</title>
      </Helmet>
      
      <Container className="mt-5 pt-3">
        <Row>
          <Col>
            <h2>Dashboard</h2>
            <p className="text-muted">Dashboard functionality will be implemented here.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
