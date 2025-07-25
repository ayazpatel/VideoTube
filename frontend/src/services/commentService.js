import api from './api';

const commentService = {
  getCommentsByVideoId: (videoId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    return api.get(`/comments/${videoId}?${queryParams.toString()}`);
  },

  addComment: (videoId, commentData) => {
    return api.post(`/comments/${videoId}`, commentData);
  },

  updateComment: (commentId, commentData) => {
    return api.patch(`/comments/c/${commentId}`, commentData);
  },

  deleteComment: (commentId) => {
    return api.delete(`/comments/c/${commentId}`);
  },
};

export default commentService;
