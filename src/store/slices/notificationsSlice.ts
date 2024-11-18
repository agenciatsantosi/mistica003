import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface NotificationPreference {
  placeId: string;
  events: boolean;
  rituals: boolean;
  consultations: boolean;
  frequency: 'daily' | 'weekly' | 'important';
  lastNotified?: number;
}

interface NotificationsState {
  preferences: Record<string, NotificationPreference>;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  preferences: {},
  loading: false,
  error: null,
};

export const fetchNotificationPreferences = createAsyncThunk(
  'notifications/fetchPreferences',
  async (userId: string) => {
    const docRef = doc(db, 'users', userId, 'notifications', 'preferences');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().preferences : {};
  }
);

export const updateNotificationPreferences = createAsyncThunk(
  'notifications/updatePreferences',
  async ({ 
    userId, 
    placeId, 
    preferences 
  }: { 
    userId: string; 
    placeId: string; 
    preferences: Partial<NotificationPreference>;
  }) => {
    const docRef = doc(db, 'users', userId, 'notifications', 'preferences');
    await setDoc(docRef, {
      preferences: {
        [placeId]: preferences
      }
    }, { merge: true });
    return { placeId, preferences };
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationPreferences.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchNotificationPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar preferências';
      })
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        const { placeId, preferences } = action.payload;
        state.preferences[placeId] = {
          ...state.preferences[placeId],
          ...preferences
        };
      });
  },
});

export default notificationsSlice.reducer;