import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface FavoritesState {
  items: string[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async (userId: string) => {
    const docRef = doc(db, 'users', userId, 'favorites', 'places');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().items as string[];
    }
    return [];
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async ({ userId, placeId, isFavorite }: { userId: string; placeId: string; isFavorite: boolean }) => {
    const docRef = doc(db, 'users', userId, 'favorites', 'places');
    await setDoc(docRef, {
      items: isFavorite ? arrayRemove(placeId) : arrayUnion(placeId)
    }, { merge: true });
    return { placeId, isFavorite: !isFavorite };
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch favorites';
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { placeId, isFavorite } = action.payload;
        if (isFavorite) {
          state.items = state.items.filter(id => id !== placeId);
        } else {
          state.items.push(placeId);
        }
      });
  },
});

export default favoritesSlice.reducer;