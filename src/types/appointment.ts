export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  ownerId: string;          // Added for consistency
  ownerName: string;
  ownerContact?: string;    // Optional
  petId: string;
  petName: string;
  petType?: string;        // Optional (e.g., "Dog", "Cat")
  date: string;            // ISO format (e.g., "2023-10-25T14:00:00Z")
  time: string;            // Format: "14:00-15:00"
  duration?: number;       // Optional (in minutes)
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string;      // Optional for tracking
}