import api from './api';

const videoService = {
  getAllVideos: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    return api.get(`/videos?${queryParams.toString()}`);
  },

  getVideoById: (videoId) => {
    return api.get(`/videos/${videoId}`);
  },

  uploadVideo: (videoData, onUploadProgress) => {
    const formData = new FormData();
    Object.keys(videoData).forEach(key => {
      if (videoData[key] instanceof File) {
        formData.append(key, videoData[key]);
      } else {
        formData.append(key, videoData[key]);
      }
    });

    return api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  updateVideo: (videoId, videoData) => {
    const formData = new FormData();
    Object.keys(videoData).forEach(key => {
      if (videoData[key] instanceof File) {
        formData.append(key, videoData[key]);
      } else {
        formData.append(key, videoData[key]);
      }
    });

    return api.patch(`/videos/${videoId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteVideo: (videoId) => {
    return api.delete(`/videos/${videoId}`);
  },

  togglePublishStatus: (videoId) => {
    return api.patch(`/videos/toggle/publish/${videoId}`);
  },
};

export default videoService;
