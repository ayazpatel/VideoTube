import api from './api';

const dashboardService = {
  getChannelStats: () => {
    return api.get('/dashboard/stats');
  },

  getChannelVideos: () => {
    return api.get('/dashboard/videos');
  },
};

export default dashboardService;
