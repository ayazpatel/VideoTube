import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotAuthorized = () => {
  return (
    <>
      <Helmet>
        <title>Access Denied - VideoTube</title>
        <meta name="description" content="You don't have permission to access this page" />
      </Helmet>
      
      <Container className="min-vh-100 d-flex align-items-center justify-content-center">
        <Row className="text-center">
          <Col>
            <div className="error-page">
              <h1 className="display-1 fw-bold text-warning">403</h1>
              <h2 className="mb-4">Access Denied</h2>
              <p className="text-muted mb-4">
                You don't have permission to access this page. Please log in or contact support.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Button as={Link} to="/login" variant="primary" size="lg">
                  Login
                </Button>
                <Button as={Link} to="/" variant="outline-primary" size="lg">
                  Go Home
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NotAuthorized;