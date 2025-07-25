import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import likeService from '../../services/likeService';

// Async thunks
export const toggleVideoLike = createAsyncThunk(
  'like/toggleVideoLike',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await likeService.toggleVideoLike(videoId);
      return { videoId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle video like');
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  'like/toggleCommentLike',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await likeService.toggleCommentLike(commentId);
      return { commentId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle comment like');
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  'like/toggleTweetLike',
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await likeService.toggleTweetLike(tweetId);
      return { tweetId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle tweet like');
    }
  }
);

export const fetchLikedVideos = createAsyncThunk(
  'like/fetchLikedVideos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await likeService.getLikedVideos();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch liked videos');
    }
  }
);

const initialState = {
  likedVideos: [],
  videoLikes: {},
  commentLikes: {},
  tweetLikes: {},
  isLoading: false,
  error: null,
};

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setVideoLike: (state, action) => {
      const { videoId, isLiked } = action.payload;
      state.videoLikes[videoId] = isLiked;
    },
    setCommentLike: (state, action) => {
      const { commentId, isLiked } = action.payload;
      state.commentLikes[commentId] = isLiked;
    },
    setTweetLike: (state, action) => {
      const { tweetId, isLiked } = action.payload;
      state.tweetLikes[tweetId] = isLiked;
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle Video Like
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        const { videoId, data } = action.payload;
        state.videoLikes[videoId] = data.isLiked;
      })
      // Toggle Comment Like
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, data } = action.payload;
        state.commentLikes[commentId] = data.isLiked;
      })
      // Toggle Tweet Like
      .addCase(toggleTweetLike.fulfilled, (state, action) => {
        const { tweetId, data } = action.payload;
        state.tweetLikes[tweetId] = data.isLiked;
      })
      // Fetch Liked Videos
      .addCase(fetchLikedVideos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLikedVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likedVideos = action.payload.data;
      })
      .addCase(fetchLikedVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setVideoLike, setCommentLike, setTweetLike } = likeSlice.actions;
export default likeSlice.reducer;
