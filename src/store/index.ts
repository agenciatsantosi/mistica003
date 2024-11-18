import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import placesReducer from './slices/placesSlice';
import commentsReducer from './slices/commentsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    places: placesReducer,
    comments: commentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'user/setCurrentUser',
          'places/fetchPlaces/pending',
          'places/fetchPlaces/fulfilled',
          'places/fetchPlaces/rejected',
          'places/fetchPendingTemples/pending',
          'places/fetchPendingTemples/fulfilled',
          'places/fetchPendingTemples/rejected',
          'places/clearPlaces'
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'payload.metadata',
          'payload.createdAt',
          'payload.updatedAt',
          'payload.proactiveRefresh',
          'payload.reloadUserInfo',
          'payload.stsTokenManager',
          'payload.auth'
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'user.currentUser.metadata',
          'user.currentUser.proactiveRefresh',
          'user.currentUser.reloadUserInfo',
          'user.currentUser.stsTokenManager',
          'user.currentUser.auth',
          'places.items',
          'places.pendingTemples'
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;