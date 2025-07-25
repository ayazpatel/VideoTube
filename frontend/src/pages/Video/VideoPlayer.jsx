import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const VideoPlayer = () => {
  return (
    <>
      <Helmet>
        <title>Video Player - VideoTube</title>
      </Helmet>
      
      <Container className="mt-5 pt-3">
        <Row>
          <Col>
            <h2>Video Player</h2>
            <p className="text-muted">Video player functionality will be implemented here.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VideoPlayer;
