import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currentUserProfile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUserProfile: (state, action) => {
      state.currentUserProfile = action.payload;
    },
    clearCurrentUserProfile: (state) => {
      state.currentUserProfile = null;
    },
  },
});

export const { clearError, setCurrentUserProfile, clearCurrentUserProfile } = userSlice.actions;
export default userSlice.reducer;
