import api from './api';

const playlistService = {
  createPlaylist: (playlistData) => {
    return api.post('/playlist', playlistData);
  },

  getPlaylistById: (playlistId) => {
    return api.get(`/playlist/${playlistId}`);
  },

  updatePlaylist: (playlistId, playlistData) => {
    return api.patch(`/playlist/${playlistId}`, playlistData);
  },

  deletePlaylist: (playlistId) => {
    return api.delete(`/playlist/${playlistId}`);
  },

  addVideoToPlaylist: (videoId, playlistId) => {
    return api.patch(`/playlist/add/${videoId}/${playlistId}`);
  },

  removeVideoFromPlaylist: (videoId, playlistId) => {
    return api.patch(`/playlist/remove/${videoId}/${playlistId}`);
  },

  getUserPlaylists: (userId) => {
    return api.get(`/playlist/user/${userId}`);
  },
};

export default playlistService;
