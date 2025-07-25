import api from './api';

const authService = {
  register: (userData) => {
    console.log('🚀 Register request initiated');
    console.log('📝 UserData received:', userData);
    
    // userData is already a FormData object from the Register component
    console.log('🌐 Making API request to:', '/users/register');
    return api.post('/users/register', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  login: (credentials) => {
    console.log('🔑 Login request initiated');
    console.log('📝 Credentials:', credentials);
    console.log('🌐 Making API request to:', '/users/login');
    return api.post('/users/login', credentials);
  },

  logout: () => {
    return api.post('/users/logout');
  },

  refreshToken: () => {
    return api.post('/users/refresh-token');
  },

  getCurrentUser: () => {
    return api.get('/users/current-user');
  },

  changePassword: (passwordData) => {
    return api.post('/users/change-password', passwordData);
  },

  updateAccount: (accountData) => {
    return api.patch('/users/update-account', accountData);
  },

  updateAvatar: (avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return api.patch('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateCoverImage: (coverImageFile) => {
    const formData = new FormData();
    formData.append('coverImage', coverImageFile);
    return api.patch('/users/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getUserChannelProfile: (username) => {
    return api.get(`/users/c/${username}`);
  },

  getWatchHistory: () => {
    return api.get('/users/history');
  },
};

export default authService;
