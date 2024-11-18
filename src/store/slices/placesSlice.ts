import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
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
  status: 'active' | 'pending' | 'rejected' | 'approved';
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

// Buscar lugares
export const fetchPlaces = createAsyncThunk(
  'places/fetchPlaces',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Iniciando busca de lugares...'); // Debug
      const placesRef = collection(db, 'places');
      const q = query(placesRef, where('status', 'in', ['active', 'approved']));
      const querySnapshot = await getDocs(q);
      
      const places = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || null,
        updatedAt: doc.data().updatedAt?.toDate?.() || null
      }));
      
      console.log('Lugares encontrados:', places.length); // Debug
      console.log('Primeiro lugar:', places[0]); // Debug
      
      return places;
    } catch (error: any) {
      console.error('Erro ao buscar lugares:', error); // Debug
      return rejectWithValue(error.message);
    }
  }
);

// Buscar templos pendentes
export const fetchPendingTemples = createAsyncThunk(
  'places/fetchPendingTemples',
  async (_, { rejectWithValue }) => {
    try {
      // Primeiro buscar todos os templos pendentes
      const q = query(
        collection(db, 'places'),
        where('status', '==', 'pending'),
        where('type', '==', 'templo')
      );
      
      const querySnapshot = await getDocs(q);
      console.log('Templos pendentes encontrados:', querySnapshot.size);
      
      const temples = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Place[];
      
      // Ordenar no cliente
      return temples.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error: any) {
      console.error('Erro ao buscar templos pendentes:', error);
      toast.error('Erro ao carregar templos pendentes');
      return rejectWithValue(error.message);
    }
  }
);

// Adicionar novo lugar
export const addPlace = createAsyncThunk(
  'places/addPlace',
  async (place: Omit<Place, 'id'>, { rejectWithValue }) => {
    try {
      const placeWithTimestamp = {
        ...place,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'places'), placeWithTimestamp);
      console.log('Lugar adicionado com ID:', docRef.id);
      
      return {
        id: docRef.id,
        ...place,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error: any) {
      console.error('Erro ao adicionar lugar:', error);
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
        status: 'approved',
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

// Excluir lugar
export const deletePlace = createAsyncThunk(
  'places/deletePlace',
  async (placeId: string, { rejectWithValue }) => {
    try {
      const placeRef = doc(db, 'places', placeId);
      await deleteDoc(placeRef);
      console.log('Lugar excluído com ID:', placeId);
      return placeId;
    } catch (error: any) {
      console.error('Erro ao excluir lugar:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Atualizar lugar
export const updatePlace = createAsyncThunk(
  'places/updatePlace',
  async ({ id, ...updates }: { id: string; [key: string]: any }, { rejectWithValue }) => {
    try {
      const placeRef = doc(db, 'places', id);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(placeRef, updateData);
      console.log('Lugar atualizado com ID:', id);
      
      return {
        id,
        ...updates,
        updatedAt: new Date()
      };
    } catch (error: any) {
      console.error('Erro ao atualizar lugar:', error);
      return rejectWithValue(error.message);
    }
  }
);

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    clearPlaces: (state) => {
      state.items = [];
      state.pendingTemples = [];
      state.loading = false;
      state.error = null;
    }
  },
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
        console.log('Places atualizados no estado:', state.items.length);
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchPendingTemples
    builder.addCase(fetchPendingTemples.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPendingTemples.fulfilled, (state, action) => {
      state.loading = false;
      state.pendingTemples = action.payload;
    });
    builder.addCase(fetchPendingTemples.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // addPlace
    builder
      .addCase(addPlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPlace.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload as Place);
      })
      .addCase(addPlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // addTemple
    builder.addCase(addTemple.fulfilled, (state, action) => {
      state.pendingTemples.unshift(action.payload);
    });

    // approveTemple
    builder.addCase(approveTemple.fulfilled, (state, action) => {
      const temple = state.pendingTemples.find(t => t.id === action.payload);
      if (temple) {
        temple.status = 'approved';
        state.items.unshift(temple);
        state.pendingTemples = state.pendingTemples.filter(t => t.id !== action.payload);
      }
    });

    // rejectTemple
    builder.addCase(rejectTemple.fulfilled, (state, action) => {
      state.pendingTemples = state.pendingTemples.filter(t => t.id !== action.payload);
    });

    // deletePlace
    builder
      .addCase(deletePlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(place => place.id !== action.payload);
      })
      .addCase(deletePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updatePlace
    builder
      .addCase(updatePlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlace.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(place => place.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updatePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearPlaces } = placesSlice.actions;
export default placesSlice.reducer;