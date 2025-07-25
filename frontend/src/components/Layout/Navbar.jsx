import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaVideo, FaHome, FaSignOutAlt, FaCog, FaUpload } from 'react-icons/fa';
import { logoutUser } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/uiSlice';
import toast from 'react-hot-toast';

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Navbar 
      bg={theme === 'dark' ? 'dark' : 'light'} 
      variant={theme === 'dark' ? 'dark' : 'light'} 
      expand="lg" 
      fixed="top" 
      className="shadow-sm py-2"
    >
      <Container fluid className="px-3">
        <Navbar.Brand as={Link} to="/" className="fw-bold me-3">
          <FaVideo className="me-2" />
          <span className="d-none d-sm-inline">VideoTube</span>
          <span className="d-sm-none">VT</span>
        </Navbar.Brand>
        
        <div className="d-flex align-items-center order-lg-3">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={handleThemeToggle}
            className="me-2 d-none d-md-inline-flex"
            style={{ minWidth: '38px', height: '38px' }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
          
          {isAuthenticated && (
            <Button
              as={Link}
              to="/upload"
              variant="primary"
              size="sm"
              className="me-2 d-none d-md-inline-flex"
            >
              <FaUpload className="me-1" />
              <span className="d-none d-lg-inline">Upload</span>
            </Button>
          )}
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </div>
        
        <Navbar.Collapse id="basic-navbar-nav" className="order-lg-2">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <FaHome className="me-1" />
              <span>Home</span>
            </Nav.Link>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/upload" className="d-md-none d-flex align-items-center">
                  <FaUpload className="me-1" />
                  Upload
                </Nav.Link>
                
                <NavDropdown 
                  title={
                    <span className="d-flex align-items-center">
                      <FaUser className="me-1" />
                      <span className="d-none d-lg-inline">{user?.fullName || 'User'}</span>
                      <span className="d-lg-none">Account</span>
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/dashboard">
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/playlists">
                    Playlists
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/settings">
                    <FaCog className="me-1" />
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    onClick={handleThemeToggle}
                    className="d-md-none"
                  >
                    {theme === 'dark' ? '☀️' : '🌙'} Theme
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
