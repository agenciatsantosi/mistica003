import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

interface Comment {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  content: string;
  createdAt: number;
}

interface CommentsState {
  items: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetch',
  async (placeId: string) => {
    const q = query(
      collection(db, 'comments'),
      where('placeId', '==', placeId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
  }
);

export const addComment = createAsyncThunk(
  'comments/add',
  async (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'comments'), {
      ...comment,
      createdAt: Date.now(),
    });
    return { id: docRef.id, ...comment, createdAt: Date.now() };
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar comentários';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default commentsSlice.reducer;