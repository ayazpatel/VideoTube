import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>Settings - VideoTube</title>
      </Helmet>
      
      <Container className="mt-5 pt-3">
        <Row>
          <Col>
            <h2>Account Settings</h2>
            <p className="text-muted">Settings functionality will be implemented here.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Settings;
