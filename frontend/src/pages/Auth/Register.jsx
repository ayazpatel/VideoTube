import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { registerUser, clearError } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      console.log('🎯 Form submitted with data:', data);
      
      // Create FormData properly
      const formData = new FormData();
      
      // Add text fields
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('fullName', data.fullName);
      
      // Add files
      if (data.avatar && data.avatar.length > 0) {
        formData.append('avatar', data.avatar[0]);
        console.log('📁 Avatar added:', data.avatar[0].name);
      }
      
      if (data.coverImage && data.coverImage.length > 0) {
        formData.append('coverImage', data.coverImage[0]);
        console.log('� Cover image added:', data.coverImage[0].name);
      }

      console.log('🚀 Dispatching registerUser...');
      await dispatch(registerUser(formData)).unwrap();
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('❌ Registration failed:', error);
      toast.error(error || 'Registration failed');
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <>
      <Helmet>
        <title>Register - VideoTube</title>
        <meta name="description" content="Create your VideoTube account" />
      </Helmet>
      
      <Container className="py-5 px-3">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 auth-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold h3">Join VideoTube</h2>
                  <p className="text-muted mb-0">Create your account to start sharing</p>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={handleClearError}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter full name"
                          {...register('fullName', {
                            required: 'Full name is required',
                            minLength: {
                              value: 2,
                              message: 'Full name must be at least 2 characters',
                            },
                          })}
                          isInvalid={errors.fullName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter username"
                          {...register('username', {
                            required: 'Username is required',
                            minLength: {
                              value: 3,
                              message: 'Username must be at least 3 characters',
                            },
                            pattern: {
                              value: /^[a-zA-Z0-9_]+$/,
                              message: 'Username can only contain letters, numbers, and underscores',
                            },
                          })}
                          isInvalid={errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email address"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      isInvalid={errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Password *</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter password"
                            {...register('password', {
                              required: 'Password is required',
                              minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters',
                              },
                              pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
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
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password *</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Confirm password"
                          {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (value) =>
                              value === password || 'Passwords do not match',
                          })}
                          isInvalid={errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Avatar *</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          {...register('avatar', {
                            required: 'Avatar image is required',
                          })}
                          isInvalid={errors.avatar}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.avatar?.message}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Upload your profile picture (JPG, PNG, GIF)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Cover Image</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          {...register('coverImage')}
                        />
                        <Form.Text className="text-muted">
                          Upload your cover image (optional)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={isLoading}
                    style={{ minHeight: '44px' }}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="mb-0 small">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Sign in here
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

export default Register;
