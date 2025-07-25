import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { loginUser, clearError } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log('🎯 Login form submitted with data:', data);
      
      // Determine if input is email or username
      const isEmail = data.usernameOrEmail.includes('@');
      
      // Transform the data to match backend expectations
      const loginData = isEmail 
        ? {
            email: data.usernameOrEmail,
            password: data.password
          }
        : {
            username: data.usernameOrEmail,
            password: data.password
          };
      
      console.log('🔄 Transformed login data:', loginData);
      console.log('📧 Login type:', isEmail ? 'email' : 'username');
      
      await dispatch(loginUser(loginData)).unwrap();
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('❌ Login failed:', error);
      toast.error(error || 'Login failed');
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <>
      <Helmet>
        <title>Login - VideoTube</title>
        <meta name="description" content="Login to your VideoTube account" />
      </Helmet>
      
      <Container className="min-vh-100 d-flex align-items-center justify-content-center px-3">
        <Row className="w-100">
          <Col xs={12} sm={10} md={8} lg={6} xl={4} className="mx-auto">
            <Card className="shadow-lg border-0 auth-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold h3">Welcome Back</h2>
                  <p className="text-muted mb-0">Sign in to your account</p>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={handleClearError}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email or Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter email or username"
                      {...register('usernameOrEmail', {
                        required: 'Email or username is required',
                      })}
                      isInvalid={errors.usernameOrEmail}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.usernameOrEmail?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                        isInvalid={errors.password}
                      />
                      <Button
                        variant="link"
                        className="position-absolute end-0 top-0 h-100 border-0"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={isLoading}
                    style={{ minHeight: '44px' }}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="mb-0 small">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;