import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import videoSlice from './slices/videoSlice';
import userSlice from './slices/userSlice';
import commentSlice from './slices/commentSlice';
import likeSlice from './slices/likeSlice';
import playlistSlice from './slices/playlistSlice';
import subscriptionSlice from './slices/subscriptionSlice';
import tweetSlice from './slices/tweetSlice';
import dashboardSlice from './slices/dashboardSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    video: videoSlice,
    user: userSlice,
    comment: commentSlice,
    like: likeSlice,
    playlist: playlistSlice,
    subscription: subscriptionSlice,
    tweet: tweetSlice,
    dashboard: dashboardSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
