import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc,
  updateDoc,
  deleteDoc,
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  serverTimestamp 
} from 'firebase/firestore';
import { toast } from 'react-toastify';

interface Comment {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  updatedAt: any;
  moderatedBy?: string;
  moderationNote?: string;
}

interface CommentsState {
  items: Comment[];
  loading: boolean;
  error: string | null;
  lastVisible: any;
  hasMore: boolean;
  filters: {
    status: 'all' | 'pending' | 'approved' | 'rejected';
    placeId?: string;
  };
}

const initialState: CommentsState = {
  items: [],
  loading: false,
  error: null,
  lastVisible: null,
  hasMore: true,
  filters: {
    status: 'all'
  }
};

// Buscar comentários com paginação e filtros
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ 
    pageSize = 10, 
    lastVisible = null,
    status = 'all',
    placeId
  }: { 
    pageSize?: number; 
    lastVisible?: any;
    status?: 'all' | 'pending' | 'approved' | 'rejected';
    placeId?: string;
  }, { rejectWithValue }) => {
    try {
      let baseQuery = collection(db, 'comments');
      let conditions = [];

      if (status !== 'all') {
        conditions.push(where('status', '==', status));
      }

      if (placeId) {
        conditions.push(where('placeId', '==', placeId));
      }

      let q = query(
        baseQuery,
        ...conditions,
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];

      return {
        comments,
        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
        hasMore: querySnapshot.docs.length === pageSize
      };
    } catch (error: any) {
      console.error('Erro ao buscar comentários:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Adicionar comentário
export const addComment = createAsyncThunk(
  'comments/addComment',
  async (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'status'>, { rejectWithValue }) => {
    try {
      const newComment = {
        ...comment,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'comments'), newComment);
      toast.success('Comentário enviado para aprovação');
      
      return {
        id: docRef.id,
        ...newComment
      };
    } catch (error: any) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Erro ao enviar comentário');
      return rejectWithValue(error.message);
    }
  }
);

// Moderar comentário
export const moderateComment = createAsyncThunk(
  'comments/moderateComment',
  async ({ 
    commentId, 
    status, 
    moderatorId, 
    note 
  }: { 
    commentId: string; 
    status: 'approved' | 'rejected'; 
    moderatorId: string;
    note?: string;
  }, { rejectWithValue }) => {
    try {
      const commentRef = doc(db, 'comments', commentId);
      const updateData = {
        status,
        moderatedBy: moderatorId,
        moderationNote: note,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(commentRef, updateData);
      toast.success(`Comentário ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`);
      
      return {
        id: commentId,
        ...updateData
      };
    } catch (error: any) {
      console.error('Erro ao moderar comentário:', error);
      toast.error('Erro ao moderar comentário');
      return rejectWithValue(error.message);
    }
  }
);

// Excluir comentário
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      const commentRef = doc(db, 'comments', commentId);
      await deleteDoc(commentRef);
      toast.success('Comentário excluído com sucesso');
      return commentId;
    } catch (error: any) {
      console.error('Erro ao excluir comentário:', error);
      toast.error('Erro ao excluir comentário');
      return rejectWithValue(error.message);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.items = [];
      state.lastVisible = null;
      state.hasMore = true;
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
      state.items = [];
      state.lastVisible = null;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    // Fetch Comments
    builder.addCase(fetchComments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.loading = false;
      if (action.meta.arg.lastVisible) {
        state.items = [...state.items, ...action.payload.comments];
      } else {
        state.items = action.payload.comments;
      }
      state.lastVisible = action.payload.lastVisible;
      state.hasMore = action.payload.hasMore;
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add Comment
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.items.unshift(action.payload as Comment);
    });

    // Moderate Comment
    builder.addCase(moderateComment.fulfilled, (state, action) => {
      const index = state.items.findIndex(comment => comment.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload
        };
      }
    });

    // Delete Comment
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.items = state.items.filter(comment => comment.id !== action.payload);
    });
  }
});

export const { clearComments, setFilters } = commentsSlice.actions;
export default commentsSlice.reducer;