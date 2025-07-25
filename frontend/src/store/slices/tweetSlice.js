import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tweetService from '../../services/tweetService';

// Async thunks
export const createTweet = createAsyncThunk(
  'tweet/createTweet',
  async (tweetData, { rejectWithValue }) => {
    try {
      const response = await tweetService.createTweet(tweetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tweet');
    }
  }
);

export const fetchUserTweets = createAsyncThunk(
  'tweet/fetchUserTweets',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await tweetService.getUserTweets(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tweets');
    }
  }
);

export const updateTweet = createAsyncThunk(
  'tweet/updateTweet',
  async ({ tweetId, content }, { rejectWithValue }) => {
    try {
      const response = await tweetService.updateTweet(tweetId, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tweet');
    }
  }
);

export const deleteTweet = createAsyncThunk(
  'tweet/deleteTweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      await tweetService.deleteTweet(tweetId);
      return tweetId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tweet');
    }
  }
);

const initialState = {
  tweets: [],
  userTweets: [],
  isLoading: false,
  error: null,
};

const tweetSlice = createSlice({
  name: 'tweet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTweets: (state) => {
      state.tweets = [];
    },
    clearUserTweets: (state) => {
      state.userTweets = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Tweet
      .addCase(createTweet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tweets.unshift(action.payload.data);
        state.userTweets.unshift(action.payload.data);
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User Tweets
      .addCase(fetchUserTweets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTweets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTweets = action.payload.data;
      })
      .addCase(fetchUserTweets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Tweet
      .addCase(updateTweet.fulfilled, (state, action) => {
        const tweetIndex = state.tweets.findIndex(tweet => tweet._id === action.payload.data._id);
        if (tweetIndex !== -1) {
          state.tweets[tweetIndex] = action.payload.data;
        }
        
        const userTweetIndex = state.userTweets.findIndex(tweet => tweet._id === action.payload.data._id);
        if (userTweetIndex !== -1) {
          state.userTweets[userTweetIndex] = action.payload.data;
        }
      })
      // Delete Tweet
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.tweets = state.tweets.filter(tweet => tweet._id !== action.payload);
        state.userTweets = state.userTweets.filter(tweet => tweet._id !== action.payload);
      });
  },
});

export const { clearError, clearTweets, clearUserTweets } = tweetSlice.actions;
export default tweetSlice.reducer;
