export type Specialization = 'skin' | 'dental' | 'behavioral' | 'general' | 'nutrition' | 'surgery';

export interface Doctor {
  id: string;
  name: string;
  specialization: Specialization[];
  location: string;
  rating: number;
  availableSlots: Slot[];
  experience?: number;
  languages?: string[];
}

export interface Slot {
  id: string;
  day: string;
   date: string; 
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  recurring?: boolean;
}