import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const Playlists = () => {
  return (
    <>
      <Helmet>
        <title>Playlists - VideoTube</title>
      </Helmet>
      
      <Container className="mt-5 pt-3">
        <Row>
          <Col>
            <h2>My Playlists</h2>
            <p className="text-muted">Playlist functionality will be implemented here.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Playlists;
