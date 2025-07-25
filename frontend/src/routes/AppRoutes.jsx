import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import pages
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import VideoPlayer from '../pages/Video/VideoPlayer';
import Upload from '../pages/Video/Upload';
import Profile from '../pages/Profile/Profile';
import Dashboard from '../pages/Dashboard/Dashboard';
import Playlists from '../pages/Playlist/Playlists';
import Settings from '../pages/Settings/Settings';
import NotFound from '../pages/Errors/NotFound';
import NotAuthorized from '../pages/Errors/NotAuthorized';

// Import components
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      <Route path="/video/:videoId" element={<VideoPlayer />} />
      <Route path="/channel/:username" element={<Profile />} />
      
      {/* Protected Routes */}
      <Route path="/upload" element={
        <ProtectedRoute>
          <Upload />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/playlists" element={
        <ProtectedRoute>
          <Playlists />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      {/* Error Routes */}
      <Route path="/unauthorized" element={<NotAuthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};

export default AppRoutes;
