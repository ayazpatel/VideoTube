import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import videoService from '../../services/videoService';

// Async thunks
export const fetchVideos = createAsyncThunk(
  'video/fetchVideos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await videoService.getAllVideos(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos');
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'video/fetchVideoById',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoService.getVideoById(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch video');
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'video/uploadVideo',
  async (videoData, { rejectWithValue }) => {
    try {
      const response = await videoService.uploadVideo(videoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload video');
    }
  }
);

export const updateVideo = createAsyncThunk(
  'video/updateVideo',
  async ({ videoId, videoData }, { rejectWithValue }) => {
    try {
      const response = await videoService.updateVideo(videoId, videoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update video');
    }
  }
);

export const deleteVideo = createAsyncThunk(
  'video/deleteVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      await videoService.deleteVideo(videoId);
      return videoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete video');
    }
  }
);

export const togglePublishStatus = createAsyncThunk(
  'video/togglePublishStatus',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoService.togglePublishStatus(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle publish status');
    }
  }
);

const initialState = {
  videos: [],
  currentVideo: null,
  totalVideos: 0,
  totalPages: 0,
  currentPage: 1,
  hasNextPage: false,
  hasPrevPage: false,
  isLoading: false,
  error: null,
  uploadProgress: 0,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Videos
      .addCase(fetchVideos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videos = action.payload.data.docs;
        state.totalVideos = action.payload.data.totalVideos;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.page;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Video by ID
      .addCase(fetchVideoById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVideo = action.payload.data;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Upload Video
      .addCase(uploadVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videos.unshift(action.payload.data);
        state.uploadProgress = 0;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      // Update Video
      .addCase(updateVideo.fulfilled, (state, action) => {
        const index = state.videos.findIndex(video => video._id === action.payload.data._id);
        if (index !== -1) {
          state.videos[index] = action.payload.data;
        }
        if (state.currentVideo?._id === action.payload.data._id) {
          state.currentVideo = action.payload.data;
        }
      })
      // Delete Video
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter(video => video._id !== action.payload);
        if (state.currentVideo?._id === action.payload) {
          state.currentVideo = null;
        }
      })
      // Toggle Publish Status
      .addCase(togglePublishStatus.fulfilled, (state, action) => {
        const index = state.videos.findIndex(video => video._id === action.payload.data._id);
        if (index !== -1) {
          state.videos[index] = action.payload.data;
        }
        if (state.currentVideo?._id === action.payload.data._id) {
          state.currentVideo = action.payload.data;
        }
      });
  },
});

export const { clearError, clearCurrentVideo, setUploadProgress, resetUploadProgress } = videoSlice.actions;
export default videoSlice.reducer;
