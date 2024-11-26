import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db, googleProvider } from '../../lib/firebase';
import { 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  visitedPlaces: string[];
  isAdmin?: boolean;
  preferences: {
    notifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
}

interface UserState {
  currentUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  profile: null,
  loading: true,
  error: null,
};

// Login com Google
export const signInWithGoogle = createAsyncThunk(
  'user/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Criar/atualizar documento do usuário
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          isAdmin: result.user.email === 'admin@mistico.com',
          visitedPlaces: [],
          preferences: {
            notifications: true,
            language: 'pt',
            theme: 'light',
          },
          createdAt: new Date(),
        });
      }

      const userData = userSnap.exists() ? userSnap.data() : null;
      
      return {
        ...result.user,
        isAdmin: userData?.isAdmin || result.user.email === 'admin@mistico.com'
      };
    } catch (error: any) {
      toast.error('Erro ao fazer login com Google');
      return rejectWithValue(error.message);
    }
  }
);

// Login com email/senha
export const signIn = createAsyncThunk(
  'user/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Buscar dados do usuário
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      // Verificar se é admin
      const isAdmin = email === 'admin@mistico.com';
      
      if (!userSnap.exists()) {
        // Criar documento do usuário se não existir
        await setDoc(userRef, {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          isAdmin,
          visitedPlaces: [],
          preferences: {
            notifications: true,
            language: 'pt',
            theme: 'light',
          },
          createdAt: new Date(),
        });
      }
      
      const userData = userSnap.exists() ? userSnap.data() : null;

      // Retornar usuário com flag isAdmin
      const userWithAdmin = {
        ...result.user,
        isAdmin: userData?.isAdmin || isAdmin
      };
      
      console.log('User data after login:', userWithAdmin); // Para debug
      
      return userWithAdmin;
    } catch (error: any) {
      toast.error('Email ou senha incorretos');
      return rejectWithValue(error.message);
    }
  }
);

// Cadastro
export const signUp = createAsyncThunk(
  'user/signUp',
  async ({ 
    email, 
    password, 
    name,
    isTemple = false,
    preferences = {
      notifications: true,
      language: 'pt',
      theme: 'light'
    },
    visitedPlaces = []
  }: { 
    email: string;
    password: string;
    name: string;
    isTemple?: boolean;
    preferences?: {
      notifications: boolean;
      language: string;
      theme: 'light' | 'dark';
    };
    visitedPlaces?: string[];
  }, { rejectWithValue }) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      
      // Lista de emails de administradores
      const isAdmin = email === 'admin@mistico.com';
      
      // Create user document
      await setDoc(doc(db, 'users', result.user.uid), {
        displayName: name,
        email,
        isAdmin,
        isTemple,
        visitedPlaces,
        preferences,
        createdAt: new Date(),
      });

      return { ...result.user, isAdmin };
    } catch (error: any) {
      toast.error('Erro ao criar conta');
      return rejectWithValue(error.message);
    }
  }
);

// Logout
export const signOut = createAsyncThunk(
  'user/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Atualizar perfil
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, data }: { userId: string; data: Partial<UserProfile> }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, data);
      return data;
    } catch (error: any) {
      toast.error('Erro ao atualizar perfil');
      return rejectWithValue(error.message);
    }
  }
);

// Buscar perfil
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      
      return null;
    } catch (error: any) {
      toast.error('Erro ao carregar perfil');
      return rejectWithValue(error.message);
    }
  }
);

// Verificar estado da autenticação
export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, 
          (user) => {
            unsubscribe();
            if (user) {
              console.log('Usuário autenticado:', user.email);
              resolve({
                email: user.email,
                uid: user.uid,
                isAdmin: true // TODO: Implementar verificação de admin
              });
            } else {
              console.log('Usuário não autenticado');
              resolve(null);
            }
          },
          (error) => {
            console.error('Erro ao verificar autenticação:', error);
            reject(error);
          }
        );
      });
    } catch (error: any) {
      console.error('Erro ao verificar autenticação:', error);
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      // Log para debug
      if (action.payload) {
        console.log('User data after login:', action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Tratamento de signInWithGoogle
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Não limpar currentUser em caso de erro
      })
      
      // Tratamento de signIn
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Não limpar currentUser em caso de erro
      })
      
      // Tratamento de signOut
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.currentUser = null;
        state.profile = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Não limpar currentUser em caso de erro de logout
      })
      
      // Tratamento de checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setUser, clearError } = userSlice.actions;
export default userSlice.reducer;