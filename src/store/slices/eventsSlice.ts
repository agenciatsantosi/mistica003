import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  addDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { toast } from 'react-toastify';

interface EventParticipant {
  userId: string;
  displayName: string;
  email: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  registeredAt: any;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  time: string;
  location: string;
  placeId?: string;
  type: 'ceremony' | 'meeting' | 'celebration' | 'other';
  maxParticipants: number;
  participants: EventParticipant[];
  status: 'scheduled' | 'cancelled' | 'completed';
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

interface EventsState {
  items: Event[];
  loading: boolean;
  error: string | null;
  lastVisible: any;
  hasMore: boolean;
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
  lastVisible: null,
  hasMore: true
};

// Buscar eventos com paginação
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ pageSize = 10, lastVisible = null }: { pageSize?: number; lastVisible?: any }, { rejectWithValue }) => {
    try {
      let q = query(
        collection(db, 'events'),
        orderBy('date', 'desc'),
        limit(pageSize)
      );

      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];

      return {
        events,
        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
        hasMore: querySnapshot.docs.length === pageSize
      };
    } catch (error: any) {
      console.error('Erro ao buscar eventos:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Criar novo evento
export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: Partial<Event>, { rejectWithValue }) => {
    try {
      const newEvent = {
        ...eventData,
        participants: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'scheduled'
      };

      const docRef = await addDoc(collection(db, 'events'), newEvent);
      toast.success('Evento criado com sucesso');
      
      return {
        id: docRef.id,
        ...newEvent
      };
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      toast.error('Erro ao criar evento');
      return rejectWithValue(error.message);
    }
  }
);

// Atualizar evento
export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ eventId, data }: { eventId: string; data: Partial<Event> }, { rejectWithValue }) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(eventRef, updateData);
      toast.success('Evento atualizado com sucesso');
      
      return {
        id: eventId,
        ...updateData
      };
    } catch (error: any) {
      console.error('Erro ao atualizar evento:', error);
      toast.error('Erro ao atualizar evento');
      return rejectWithValue(error.message);
    }
  }
);

// Cancelar evento
export const cancelEvent = createAsyncThunk(
  'events/cancelEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });
      
      toast.success('Evento cancelado com sucesso');
      return eventId;
    } catch (error: any) {
      console.error('Erro ao cancelar evento:', error);
      toast.error('Erro ao cancelar evento');
      return rejectWithValue(error.message);
    }
  }
);

// Gerenciar participante
export const manageParticipant = createAsyncThunk(
  'events/manageParticipant',
  async ({ 
    eventId, 
    userId, 
    action 
  }: { 
    eventId: string; 
    userId: string; 
    action: 'confirm' | 'cancel' | 'remove' 
  }, { rejectWithValue }) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const event = (await getDocs(query(collection(db, 'events'), where('id', '==', eventId)))).docs[0].data() as Event;
      
      let participants = [...event.participants];
      const participantIndex = participants.findIndex(p => p.userId === userId);
      
      if (action === 'remove') {
        if (participantIndex !== -1) {
          participants.splice(participantIndex, 1);
        }
      } else {
        if (participantIndex !== -1) {
          participants[participantIndex].status = action === 'confirm' ? 'confirmed' : 'cancelled';
        }
      }
      
      await updateDoc(eventRef, {
        participants,
        updatedAt: serverTimestamp()
      });
      
      toast.success('Participante atualizado com sucesso');
      return {
        eventId,
        participants
      };
    } catch (error: any) {
      console.error('Erro ao gerenciar participante:', error);
      toast.error('Erro ao gerenciar participante');
      return rejectWithValue(error.message);
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEvents: (state) => {
      state.items = [];
      state.lastVisible = null;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    // Fetch Events
    builder.addCase(fetchEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.loading = false;
      if (action.meta.arg.lastVisible) {
        state.items = [...state.items, ...action.payload.events];
      } else {
        state.items = action.payload.events;
      }
      state.lastVisible = action.payload.lastVisible;
      state.hasMore = action.payload.hasMore;
    });
    builder.addCase(fetchEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Event
    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.items.unshift(action.payload as Event);
    });

    // Update Event
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      const index = state.items.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload
        };
      }
    });

    // Cancel Event
    builder.addCase(cancelEvent.fulfilled, (state, action) => {
      const index = state.items.findIndex(event => event.id === action.payload);
      if (index !== -1) {
        state.items[index].status = 'cancelled';
      }
    });

    // Manage Participant
    builder.addCase(manageParticipant.fulfilled, (state, action) => {
      const index = state.items.findIndex(event => event.id === action.payload.eventId);
      if (index !== -1) {
        state.items[index].participants = action.payload.participants;
      }
    });
  }
});

export const { clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
