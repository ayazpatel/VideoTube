import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  return (
    <>
      <Helmet>
        <title>Profile - VideoTube</title>
      </Helmet>
      
      <Container className="mt-5 pt-3">
        <Row>
          <Col>
            <h2>User Profile</h2>
            <p className="text-muted">User profile functionality will be implemented here.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
