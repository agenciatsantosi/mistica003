import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import favoritesReducer from './slices/favoritesSlice';
import placesReducer from './slices/placesSlice';
import commentsReducer from './slices/commentsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    favorites: favoritesReducer,
    places: placesReducer,
    comments: commentsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;