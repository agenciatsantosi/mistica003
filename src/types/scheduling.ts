export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  placeId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentPayload {
  userId: string;
  placeId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes?: string;
}

export interface FetchSlotsPayload {
  placeId: string;
  date: string;
}

export interface SchedulingState {
  appointments: Appointment[];
  availableSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
}
