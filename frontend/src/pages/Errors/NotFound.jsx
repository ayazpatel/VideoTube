import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - VideoTube</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Helmet>
      
      <Container className="min-vh-100 d-flex align-items-center justify-content-center">
        <Row className="text-center">
          <Col>
            <div className="error-page">
              <h1 className="display-1 fw-bold text-primary">404</h1>
              <h2 className="mb-4">Page Not Found</h2>
              <p className="text-muted mb-4">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Button as={Link} to="/" variant="primary" size="lg">
                Go Back Home
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NotFound;
