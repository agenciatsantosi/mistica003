import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { toast } from 'react-toastify';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  createdAt: any;
  lastLogin?: any;
  visitedPlaces?: string[];
  preferences?: {
    notifications: boolean;
    language: string;
    theme: string;
  };
}

interface AdminState {
  users: {
    items: User[];
    loading: boolean;
    error: string | null;
    lastVisible: any;
    hasMore: boolean;
  };
  stats: {
    totalUsers: number;
    totalPlaces: number;
    totalEvents: number;
    totalComments: number;
    loading: boolean;
    error: string | null;
  };
}

const initialState: AdminState = {
  users: {
    items: [],
    loading: false,
    error: null,
    lastVisible: null,
    hasMore: true
  },
  stats: {
    totalUsers: 0,
    totalPlaces: 0,
    totalEvents: 0,
    totalComments: 0,
    loading: false,
    error: null
  }
};

// Buscar usuários com paginação
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({ pageSize = 10, lastVisible = null }: { pageSize?: number; lastVisible?: any }, { rejectWithValue }) => {
    try {
      let q = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      return {
        users,
        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
        hasMore: querySnapshot.docs.length === pageSize
      };
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Atualizar role do usuário
export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }: { userId: string; role: 'admin' | 'user' }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role });
      toast.success('Função do usuário atualizada com sucesso');
      return { userId, role };
    } catch (error: any) {
      console.error('Erro ao atualizar função do usuário:', error);
      toast.error('Erro ao atualizar função do usuário');
      return rejectWithValue(error.message);
    }
  }
);

// Bloquear/Desbloquear usuário
export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }: { userId: string; status: 'active' | 'blocked' }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status });
      toast.success(`Usuário ${status === 'active' ? 'desbloqueado' : 'bloqueado'} com sucesso`);
      return { userId, status };
    } catch (error: any) {
      console.error('Erro ao atualizar status do usuário:', error);
      toast.error('Erro ao atualizar status do usuário');
      return rejectWithValue(error.message);
    }
  }
);

// Buscar estatísticas do dashboard
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = {
        totalUsers: 0,
        totalPlaces: 0,
        totalEvents: 0,
        totalComments: 0
      };

      // Contagem de usuários
      const usersSnapshot = await getDocs(collection(db, 'users'));
      stats.totalUsers = usersSnapshot.size;

      // Contagem de lugares
      const placesSnapshot = await getDocs(collection(db, 'places'));
      stats.totalPlaces = placesSnapshot.size;

      // Contagem de eventos
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      stats.totalEvents = eventsSnapshot.size;

      // Contagem de comentários
      const commentsSnapshot = await getDocs(collection(db, 'comments'));
      stats.totalComments = commentsSnapshot.size;

      return stats;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users.items = [];
      state.users.lastVisible = null;
      state.users.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.users.loading = true;
      state.users.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users.loading = false;
      if (action.meta.arg.lastVisible) {
        state.users.items = [...state.users.items, ...action.payload.users];
      } else {
        state.users.items = action.payload.users;
      }
      state.users.lastVisible = action.payload.lastVisible;
      state.users.hasMore = action.payload.hasMore;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.users.loading = false;
      state.users.error = action.payload as string;
    });

    // Update User Role
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      const userIndex = state.users.items.findIndex(user => user.id === action.payload.userId);
      if (userIndex !== -1) {
        state.users.items[userIndex].role = action.payload.role;
      }
    });

    // Update User Status
    builder.addCase(updateUserStatus.fulfilled, (state, action) => {
      const userIndex = state.users.items.findIndex(user => user.id === action.payload.userId);
      if (userIndex !== -1) {
        state.users.items[userIndex].status = action.payload.status;
      }
    });

    // Fetch Dashboard Stats
    builder.addCase(fetchDashboardStats.pending, (state) => {
      state.stats.loading = true;
      state.stats.error = null;
    });
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
      state.stats.loading = false;
      state.stats = {
        ...state.stats,
        ...action.payload
      };
    });
    builder.addCase(fetchDashboardStats.rejected, (state, action) => {
      state.stats.loading = false;
      state.stats.error = action.payload as string;
    });
  }
});

export const { clearUsers } = adminSlice.actions;
export default adminSlice.reducer;
