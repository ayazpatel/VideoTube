import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const Upload = () => {
  return (
    <>
      <Helmet>
        <title>Upload Video - VideoTube</title>
      </Helmet>
      
      <Container className="mt-5 pt-3">
        <Row>
          <Col>
            <h2>Upload Video</h2>
            <p className="text-muted">Video upload functionality will be implemented here.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Upload;
