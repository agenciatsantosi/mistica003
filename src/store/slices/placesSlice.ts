import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface Place {
  id: string;
  type: string;
  name: string;
  images: string[];
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  hours?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'pending' | 'rejected';
  createdAt?: any;
  updatedAt?: any;
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

// Buscar todos os lugares ativos
export const fetchPlaces = createAsyncThunk(
  'places/fetchPlaces',
  async (_, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'places'));
      const querySnapshot = await getDocs(q);
      console.log('Lugares encontrados:', querySnapshot.size); // Debug
      
      const places = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Dados do lugar:', doc.id, data); // Debug
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        };
      }) as Place[];
      
      return places;
    } catch (error: any) {
      console.error('Erro ao buscar lugares:', error);
      toast.error('Erro ao carregar lugares');
      return rejectWithValue(error.message);
    }
  }
);

// Buscar templos pendentes
export const fetchPendingTemples = createAsyncThunk(
  'places/fetchPendingTemples',
  async (_, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, 'places'),
        where('status', '==', 'pending'),
        where('type', '==', 'templo')
      );
      const querySnapshot = await getDocs(q);
      const temples = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Place[];
      
      return temples;
    } catch (error: any) {
      console.error('Erro ao buscar templos pendentes:', error);
      toast.error('Erro ao carregar templos pendentes');
      return rejectWithValue(error.message);
    }
  }
);

// Adicionar novo local
export const addPlace = createAsyncThunk(
  'places/addPlace',
  async (placeData: Omit<Place, 'id'>, { rejectWithValue }) => {
    try {
      const dataWithTimestamp = {
        ...placeData,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'places'), dataWithTimestamp);
      
      toast.success('Local adicionado com sucesso!');
      return { 
        id: docRef.id, 
        ...placeData,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
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
        type: 'templo',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'places'), dataWithTimestamp);
      
      toast.success('Templo cadastrado com sucesso! Aguardando aprovação.');
      return { 
        id: docRef.id, 
        ...templeData,
        type: 'templo',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error: any) {
      console.error('Erro ao cadastrar templo:', error);
      toast.error('Erro ao cadastrar templo');
      return rejectWithValue(error.message);
    }
  }
);

// Aprovar templo
export const approveTemple = createAsyncThunk(
  'places/approveTemple',
  async (templeId: string, { rejectWithValue }) => {
    try {
      const templeRef = doc(db, 'places', templeId);
      await updateDoc(templeRef, {
        status: 'active',
        updatedAt: serverTimestamp()
      });

      toast.success('Templo aprovado com sucesso!');
      return templeId;
    } catch (error: any) {
      console.error('Erro ao aprovar templo:', error);
      toast.error('Erro ao aprovar templo');
      return rejectWithValue(error.message);
    }
  }
);

// Rejeitar templo
export const rejectTemple = createAsyncThunk(
  'places/rejectTemple',
  async (templeId: string, { rejectWithValue }) => {
    try {
      const templeRef = doc(db, 'places', templeId);
      await updateDoc(templeRef, {
        status: 'rejected',
        updatedAt: serverTimestamp()
      });

      toast.success('Templo rejeitado com sucesso');
      return templeId;
    } catch (error: any) {
      console.error('Erro ao rejeitar templo:', error);
      toast.error('Erro ao rejeitar templo');
      return rejectWithValue(error.message);
    }
  }
);

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchPlaces
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // fetchPendingTemples
    builder
      .addCase(fetchPendingTemples.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingTemples.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTemples = action.payload;
      })
      .addCase(fetchPendingTemples.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
    // addPlace
    builder
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

    // addTemple
    builder
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

    // approveTemple
    builder
      .addCase(approveTemple.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveTemple.fulfilled, (state, action) => {
        state.loading = false;
        const temple = state.pendingTemples.find(t => t.id === action.payload);
        if (temple) {
          state.items.push({ ...temple, status: 'active' });
          state.pendingTemples = state.pendingTemples.filter(t => t.id !== action.payload);
        }
      })
      .addCase(approveTemple.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // rejectTemple
    builder
      .addCase(rejectTemple.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectTemple.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTemples = state.pendingTemples.filter(t => t.id !== action.payload);
      })
      .addCase(rejectTemple.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { reducer: placesReducer } = placesSlice;
export default placesReducer;