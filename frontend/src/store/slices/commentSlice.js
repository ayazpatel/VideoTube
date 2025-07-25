import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '../../services/commentService';

// Async thunks
export const fetchComments = createAsyncThunk(
  'comment/fetchComments',
  async ({ videoId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await commentService.getCommentsByVideoId(videoId, { page, limit });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comment/addComment',
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const response = await commentService.addComment(videoId, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await commentService.updateComment(commentId, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

const initialState = {
  comments: [],
  totalComments: 0,
  totalPages: 0,
  currentPage: 1,
  hasNextPage: false,
  hasPrevPage: false,
  isLoading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
      state.totalComments = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.hasNextPage = false;
      state.hasPrevPage = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload.data.docs;
        state.totalComments = action.payload.data.totalDocs;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.page;
        state.hasNextPage = action.payload.data.hasNextPage;
        state.hasPrevPage = action.payload.data.hasPrevPage;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload.data);
        state.totalComments += 1;
      })
      // Update Comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment._id === action.payload.data._id);
        if (index !== -1) {
          state.comments[index] = action.payload.data;
        }
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment._id !== action.payload);
        state.totalComments -= 1;
      });
  },
});

export const { clearError, clearComments } = commentSlice.actions;
export default commentSlice.reducer;
