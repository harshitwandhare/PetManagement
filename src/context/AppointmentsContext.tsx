import React, { ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Appointment, AppointmentStatus } from '../types/appointment';
import { 
  getAppointments, 
  addAppointment as apiAddAppointment, 
  updateAppointment as apiUpdateAppointment,
  cancelAppointment as apiCancelAppointment
} from '../services/appointments';
import { useDoctors } from './DoctorsContext';

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Promise<string>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<boolean>;
  cancelAppointment: (id: string) => Promise<boolean>;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => Promise<boolean>;
  getAppointmentsByPet: (petId: string) => Appointment[];
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  getAppointmentsByOwner: (ownerId: string) => Appointment[];
  getUpcomingAppointments: () => Appointment[];
  refreshAppointments: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export const AppointmentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
const { updateDoctor, doctors } = useDoctors(); 

  const refreshAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedAppointments = await getAppointments();
      console.log('Loaded appointments from storage:', loadedAppointments);
      setAppointments(loadedAppointments);
    } catch (err) {
      console.error('Error refreshing appointments:', err);
      setError(err instanceof Error ? err : new Error('Failed to load appointments'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  const addAppointment = useCallback(async (
    appointment: Omit<Appointment, 'id' | 'status'>
  ): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check for duplicate appointment
      const duplicateExists = appointments.some(apt => 
        apt.doctorId === appointment.doctorId &&
        apt.date === appointment.date &&
        apt.time === appointment.time &&
        apt.status !== 'cancelled'
      );
      
      if (duplicateExists) {
        throw new Error('An appointment already exists for this time slot');
      }

      const newAppointment: Appointment = {
        ...appointment,
        id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'upcoming'
      };
      
      console.log('Adding new appointment:', newAppointment);
      
      // Use the service to add appointment (this will handle storage)
      const success = await apiAddAppointment(newAppointment);
      if (!success) {
        throw new Error('Failed to save appointment to storage');
      }
      
      // Update local state
      setAppointments(prev => {
        const updated = [...prev, newAppointment];
        console.log('Updated appointments state:', updated);
        return updated;
      });
      
      return newAppointment.id;
    } catch (err) {
      console.error('Error adding appointment:', err);
      setError(err instanceof Error ? err : new Error('Failed to add appointment'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [appointments]);

  const updateAppointment = useCallback(async (
    id: string, 
    updates: Partial<Appointment>
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Updating appointment:', id, updates);
      
      const updatedAppointment = await apiUpdateAppointment(id, updates);
      
      setAppointments(prev => {
        const updated = prev.map(app => app.id === id ? updatedAppointment : app);
        console.log('Updated appointments after update:', updated);
        return updated;
      });
      
      return true;
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(err instanceof Error ? err : new Error('Failed to update appointment'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

 const cancelAppointment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Find the appointment being cancelled
      const appointment = appointments.find(app => app.id === id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Find the doctor for this appointment
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      // Parse the time slot (format: "09:00-10:00")
      const [startTime] = appointment.time.split('-');
      const dayName = new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long' });

      // Update the doctor's available slots
      const updatedSlots = doctor.availableSlots.map(slot => {
        if (slot.day === dayName && slot.startTime === startTime) {
          return { ...slot, isAvailable: true };
        }
        return slot;
      });

      // First update the doctor's availability
      await updateDoctor(doctor.id, {
        availableSlots: updatedSlots
      });

      // Then cancel the appointment
      console.log('Cancelling appointment:', id);
      const success = await apiCancelAppointment(id);
      if (!success) {
        throw new Error('Failed to cancel appointment');
      }
      
      // Update local state
      setAppointments(prev => {
        const updated = prev.map(app => 
          app.id === id ? { ...app, status: 'cancelled' as AppointmentStatus } : app
        );
        console.log('Updated appointments after cancel:', updated);
        return updated;
      });
      
      return true;
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(err instanceof Error ? err : new Error('Failed to cancel appointment'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [appointments, doctors, updateDoctor]);


  const rescheduleAppointment = useCallback(async (
    id: string,
    newDate: string,
    newTime: string
  ): Promise<boolean> => {
    return updateAppointment(id, { 
      date: newDate,
      time: newTime,
      status: 'upcoming' as AppointmentStatus
    });
  }, [updateAppointment]);

  const getAppointmentsByPet = useCallback((petId: string) => {
    const filtered = appointments.filter(app => app.petId === petId);
    console.log(`Appointments for pet ${petId}:`, filtered);
    return filtered;
  }, [appointments]);

  const getAppointmentsByDoctor = useCallback((doctorId: string) => {
    const filtered = appointments.filter(app => app.doctorId === doctorId);
    console.log(`Appointments for doctor ${doctorId}:`, filtered);
    return filtered;
  }, [appointments]);

  const getAppointmentsByOwner = useCallback((ownerId: string) => {
    const filtered = appointments.filter(app => app.ownerId === ownerId);
    console.log(`Appointments for owner ${ownerId}:`, filtered);
    return filtered;
  }, [appointments]);

  const getUpcomingAppointments = useCallback(() => {
    const now = new Date();
    const filtered = appointments.filter(app => 
      new Date(app.date) >= now && 
      app.status === 'upcoming'
    );
    console.log('Upcoming appointments:', filtered);
    return filtered;
  }, [appointments]);

  return (
    <AppointmentsContext.Provider value={{ 
      appointments,
      addAppointment,
      updateAppointment,
      cancelAppointment,
      rescheduleAppointment,
      getAppointmentsByPet,
      getAppointmentsByDoctor,
      getAppointmentsByOwner,
      getUpcomingAppointments,
      refreshAppointments,
      isLoading,
      error
    }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = (): AppointmentsContextType => {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
};