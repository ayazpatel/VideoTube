import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import playlistService from '../../services/playlistService';

// Async thunks
export const createPlaylist = createAsyncThunk(
  'playlist/createPlaylist',
  async (playlistData, { rejectWithValue }) => {
    try {
      const response = await playlistService.createPlaylist(playlistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create playlist');
    }
  }
);

export const fetchPlaylistById = createAsyncThunk(
  'playlist/fetchPlaylistById',
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await playlistService.getPlaylistById(playlistId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch playlist');
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  'playlist/updatePlaylist',
  async ({ playlistId, playlistData }, { rejectWithValue }) => {
    try {
      const response = await playlistService.updatePlaylist(playlistId, playlistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update playlist');
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  'playlist/deletePlaylist',
  async (playlistId, { rejectWithValue }) => {
    try {
      await playlistService.deletePlaylist(playlistId);
      return playlistId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete playlist');
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  'playlist/addVideoToPlaylist',
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await playlistService.addVideoToPlaylist(videoId, playlistId);
      return { videoId, playlistId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add video to playlist');
    }
  }
);

export const removeVideoFromPlaylist = createAsyncThunk(
  'playlist/removeVideoFromPlaylist',
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await playlistService.removeVideoFromPlaylist(videoId, playlistId);
      return { videoId, playlistId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove video from playlist');
    }
  }
);

export const fetchUserPlaylists = createAsyncThunk(
  'playlist/fetchUserPlaylists',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await playlistService.getUserPlaylists(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user playlists');
    }
  }
);

const initialState = {
  playlists: [],
  currentPlaylist: null,
  userPlaylists: [],
  isLoading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Playlist
      .addCase(createPlaylist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playlists.unshift(action.payload.data);
        state.userPlaylists.unshift(action.payload.data);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Playlist by ID
      .addCase(fetchPlaylistById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlaylist = action.payload.data;
      })
      .addCase(fetchPlaylistById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Playlist
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        const index = state.playlists.findIndex(playlist => playlist._id === action.payload.data._id);
        if (index !== -1) {
          state.playlists[index] = action.payload.data;
        }
        
        const userIndex = state.userPlaylists.findIndex(playlist => playlist._id === action.payload.data._id);
        if (userIndex !== -1) {
          state.userPlaylists[userIndex] = action.payload.data;
        }
        
        if (state.currentPlaylist?._id === action.payload.data._id) {
          state.currentPlaylist = action.payload.data;
        }
      })
      // Delete Playlist
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.playlists = state.playlists.filter(playlist => playlist._id !== action.payload);
        state.userPlaylists = state.userPlaylists.filter(playlist => playlist._id !== action.payload);
        if (state.currentPlaylist?._id === action.payload) {
          state.currentPlaylist = null;
        }
      })
      // Fetch User Playlists
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPlaylists = action.payload.data;
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
