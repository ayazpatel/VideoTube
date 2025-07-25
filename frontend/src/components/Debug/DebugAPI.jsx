import React, { useState } from 'react';
import { Button, Container, Alert, Card } from 'react-bootstrap';
import api from '../../services/api';

const DebugAPI = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testHealthcheck = async () => {
    setLoading(true);
    setStatus('Testing healthcheck...');
    try {
      const response = await api.get('/healthcheck');
      setStatus(`✅ Success: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Healthcheck error:', error);
    }
    setLoading(false);
  };

  const testRegister = async () => {
    setLoading(true);
    setStatus('Testing register endpoint...');
    try {
      // Create a simple FormData for testing
      const formData = new FormData();
      formData.append('username', 'testuser123');
      formData.append('email', 'test@example.com');
      formData.append('password', 'TestPassword123!');
      formData.append('fullName', 'Test User');
      
      const response = await api.post('/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus(`✅ Register Success: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setStatus(`❌ Register Error: ${error.response?.data?.message || error.message}`);
      console.error('Register error:', error);
    }
    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header>
          <h3>API Debug Panel</h3>
        </Card.Header>
        <Card.Body>
          <div className="d-grid gap-2 mb-3">
            <Button 
              variant="primary" 
              onClick={testHealthcheck} 
              disabled={loading}
            >
              Test Healthcheck API
            </Button>
            <Button 
              variant="warning" 
              onClick={testRegister} 
              disabled={loading}
            >
              Test Register API (will fail - no avatar)
            </Button>
          </div>
          
          {status && (
            <Alert variant={status.includes('✅') ? 'success' : 'danger'}>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{status}</pre>
            </Alert>
          )}
          
          <div className="mt-3">
            <h5>Current API Configuration:</h5>
            <ul>
              <li><strong>Frontend URL:</strong> http://localhost:5173</li>
              <li><strong>Backend URL:</strong> {import.meta.env.VITE_API_BASE_URL}</li>
              <li><strong>Environment:</strong> {import.meta.env.MODE}</li>
            </ul>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DebugAPI;
