import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface Place {
  id: string;
  type: string;
  name: string;
  image: string;
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviews: number;
  description: string;
  category: string;
  hours: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'pending' | 'rejected';
  createdAt?: any;
  email?: string;
}

interface PlacesState {
  items: Place[];
  pendingTemples: Place[];
  loading: boolean;
  error: string | null;
}

const initialState: PlacesState = {
  items: [],
  pendingTemples: [],
  loading: false,
  error: null
};

// Adicionar novo local
export const addPlace = createAsyncThunk(
  'places/addPlace',
  async (placeData: Omit<Place, 'id'>, { rejectWithValue }) => {
    try {
      const dataWithTimestamp = {
        ...placeData,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'places'), dataWithTimestamp);
      
      toast.success('Local adicionado com sucesso!');
      return { 
        id: docRef.id, 
        ...placeData,
        createdAt: new Date().toISOString() 
      };
    } catch (error: any) {
      console.error('Erro ao adicionar local:', error);
      toast.error('Erro ao adicionar local');
      return rejectWithValue(error.message);
    }
  }
);

// Adicionar templo pendente
export const addTemple = createAsyncThunk(
  'places/addTemple',
  async (templeData: Omit<Place, 'id'>, { rejectWithValue }) => {
    try {
      const dataWithTimestamp = {
        ...templeData,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'pendingTemples'), dataWithTimestamp);
      
      toast.success('Templo cadastrado com sucesso! Aguardando aprovação.');
      return { 
        id: docRef.id, 
        ...templeData, 
        status: 'pending',
        createdAt: new Date().toISOString() 
      };
    } catch (error: any) {
      console.error('Erro ao cadastrar templo:', error);
      toast.error('Erro ao cadastrar templo');
      return rejectWithValue(error.message);
    }
  }
);

// Buscar templos pendentes
export const fetchPendingTemples = createAsyncThunk(
  'places/fetchPendingTemples',
  async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pendingTemples'));
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() })) as Place[];
    } catch (error: any) {
      console.error('Erro ao buscar templos pendentes:', error);
      toast.error('Erro ao carregar templos pendentes');
      throw error;
    }
  }
);

// Aprovar templo
export const approveTemple = createAsyncThunk(
  'places/approveTemple',
  async (templeId: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pendingTemples'));
      const templeDoc = querySnapshot.docs.find(doc => doc.id === templeId);
      
      if (!templeDoc) {
        throw new Error('Templo não encontrado');
      }

      const templeData = templeDoc.data();

      // Adicionar à coleção principal de lugares
      await addDoc(collection(db, 'places'), {
        ...templeData,
        status: 'active',
        updatedAt: serverTimestamp()
      });

      // Atualizar status no documento original
      const templeRef = doc(db, 'pendingTemples', templeId);
      await updateDoc(templeRef, { 
        status: 'active',
        updatedAt: serverTimestamp()
      });

      toast.success('Templo aprovado com sucesso!');
      return templeId;
    } catch (error: any) {
      console.error('Erro ao aprovar templo:', error);
      toast.error('Erro ao aprovar templo');
      throw error;
    }
  }
);

// Rejeitar templo
export const rejectTemple = createAsyncThunk(
  'places/rejectTemple',
  async (templeId: string) => {
    try {
      const templeRef = doc(db, 'pendingTemples', templeId);
      await updateDoc(templeRef, { 
        status: 'rejected',
        updatedAt: serverTimestamp()
      });
      toast.success('Templo rejeitado com sucesso');
      return templeId;
    } catch (error: any) {
      console.error('Erro ao rejeitar templo:', error);
      toast.error('Erro ao rejeitar templo');
      throw error;
    }
  }
);

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Place
      .addCase(addPlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPlace.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addPlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Temple
      .addCase(addTemple.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTemple.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTemples.push(action.payload);
      })
      .addCase(addTemple.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Pending Temples
      .addCase(fetchPendingTemples.fulfilled, (state, action) => {
        state.pendingTemples = action.payload;
      })
      // Approve Temple
      .addCase(approveTemple.fulfilled, (state, action) => {
        const temple = state.pendingTemples.find(t => t.id === action.payload);
        if (temple) {
          state.items.push({ ...temple, status: 'active' });
          state.pendingTemples = state.pendingTemples.filter(t => t.id !== action.payload);
        }
      })
      // Reject Temple
      .addCase(rejectTemple.fulfilled, (state, action) => {
        state.pendingTemples = state.pendingTemples.filter(t => t.id !== action.payload);
      });
  }
});

export const { reducer: placesReducer } = placesSlice;
export default placesReducer;