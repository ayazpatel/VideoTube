import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subscriptionService from '../../services/subscriptionService';

// Async thunks
export const toggleSubscription = createAsyncThunk(
  'subscription/toggleSubscription',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.toggleSubscription(channelId);
      return { channelId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle subscription');
    }
  }
);

export const fetchChannelSubscribers = createAsyncThunk(
  'subscription/fetchChannelSubscribers',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getChannelSubscribers(channelId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscribers');
    }
  }
);

export const fetchSubscribedChannels = createAsyncThunk(
  'subscription/fetchSubscribedChannels',
  async (subscriberId, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getSubscribedChannels(subscriberId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscribed channels');
    }
  }
);

const initialState = {
  subscribers: [],
  subscribedChannels: [],
  subscriptionStatus: {},
  isLoading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSubscriptionStatus: (state, action) => {
      const { channelId, isSubscribed } = action.payload;
      state.subscriptionStatus[channelId] = isSubscribed;
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle Subscription
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        const { channelId, data } = action.payload;
        state.subscriptionStatus[channelId] = data.isSubscribed;
      })
      // Fetch Channel Subscribers
      .addCase(fetchChannelSubscribers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChannelSubscribers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscribers = action.payload.data;
      })
      .addCase(fetchChannelSubscribers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Subscribed Channels
      .addCase(fetchSubscribedChannels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscribedChannels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscribedChannels = action.payload.data;
      })
      .addCase(fetchSubscribedChannels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSubscriptionStatus } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
