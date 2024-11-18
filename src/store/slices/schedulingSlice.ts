import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Appointment, 
  CreateAppointmentPayload, 
  FetchSlotsPayload, 
  SchedulingState,
  TimeSlot 
} from '../../types/scheduling';

const initialState: SchedulingState = {
  appointments: [],
  availableSlots: [],
  loading: false,
  error: null,
};

// Simula horários disponíveis (em produção, isso viria do backend)
const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const hours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  
  hours.forEach(time => {
    slots.push({
      time,
      available: Math.random() > 0.3 // Simula disponibilidade aleatória
    });
  });
  
  return slots;
};

export const fetchAvailableSlots = createAsyncThunk(
  'scheduling/fetchAvailableSlots',
  async ({ placeId, date }: FetchSlotsPayload) => {
    // Em produção, aqui faria uma chamada ao backend
    return generateTimeSlots(date);
  }
);

export const createAppointment = createAsyncThunk(
  'scheduling/createAppointment',
  async (appointment: CreateAppointmentPayload) => {
    const appointmentData = {
      ...appointment,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
    return { id: docRef.id, ...appointmentData };
  }
);

export const fetchAppointments = createAsyncThunk(
  'scheduling/fetchAppointments',
  async (userId: string) => {
    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      appointments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      } as Appointment);
    });

    return appointments;
  }
);

const schedulingSlice = createSlice({
  name: 'scheduling',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAvailableSlots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar horários disponíveis';
      })
      // createAppointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.unshift(action.payload as Appointment);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar agendamento';
      })
      // fetchAppointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar agendamentos';
      });
  },
});

export default schedulingSlice.reducer;
