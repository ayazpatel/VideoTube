import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboardService';

// Async thunks
export const fetchChannelStats = createAsyncThunk(
  'dashboard/fetchChannelStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getChannelStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channel stats');
    }
  }
);

export const fetchChannelVideos = createAsyncThunk(
  'dashboard/fetchChannelVideos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getChannelVideos();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channel videos');
    }
  }
);

const initialState = {
  stats: {
    totalVideos: 0,
    totalViews: 0,
    totalSubscribers: 0,
    totalLikes: 0,
  },
  channelVideos: [],
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetDashboard: (state) => {
      state.stats = {
        totalVideos: 0,
        totalViews: 0,
        totalSubscribers: 0,
        totalLikes: 0,
      };
      state.channelVideos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Channel Stats
      .addCase(fetchChannelStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChannelStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchChannelStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Channel Videos
      .addCase(fetchChannelVideos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChannelVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channelVideos = action.payload.data;
      })
      .addCase(fetchChannelVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
