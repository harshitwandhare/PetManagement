import { Appointment } from '../types/appointment';
import { storeData, getData } from './storage';

const APPOINTMENTS_KEY = 'appointments';

// Get all appointments from storage
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const appointments = await getData<Appointment[]>(APPOINTMENTS_KEY);
    console.log('Retrieved appointments from storage:', appointments);
    
    if (!appointments || appointments.length === 0) {
      // Initialize with sample data if empty - using consistent doctor ID
      const drEmail = 'doctor@test.com';
      const drId = `doctor-${drEmail.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
      
      console.log('Appointments Service: Creating sample appointment for doctor ID:', drId);
      
      const sampleAppointments: Appointment[] = [
        {
          id: 'apt-sample-1',
          doctorId: drId, // This matches the doctor ID from DoctorsContext
          doctorName: 'Dr. Harshit',
          ownerId: 'owner-john-example-com',
          ownerName: 'John Doe',
          petId: 'pet-1',
          petName: 'Buddy',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
          time: '10:00-11:00', // Consistent time format
          reason: 'Annual checkup',
          status: 'upcoming',
          createdAt: new Date().toISOString()
        }
      ];
      
      console.log('Initializing with sample appointments:', sampleAppointments);
      await storeData(APPOINTMENTS_KEY, sampleAppointments);
      return sampleAppointments;
    }
    
    return appointments;
  } catch (error) {
    console.error('Error loading appointments:', error);
    return [];
  }
};

// Add a new appointment
export const addAppointment = async (appointment: Appointment): Promise<boolean> => {
  try {
    console.log('Service: Adding appointment:', appointment);
    
    const appointments = await getAppointments();
    
    // Check for duplicates - handle both time formats
    const isDuplicate = appointments.some(apt => {
      const aptStartTime = apt.time.includes('-') ? apt.time.split('-')[0] : apt.time;
      const newStartTime = appointment.time.includes('-') ? appointment.time.split('-')[0] : appointment.time;
      
      return apt.doctorId === appointment.doctorId &&
        apt.date === appointment.date &&
        aptStartTime === newStartTime &&
        apt.status !== 'cancelled';
    });
    
    if (isDuplicate) {
      console.error('Duplicate appointment detected');
      throw new Error('Appointment slot already taken');
    }
    
    appointments.push(appointment);
    
    console.log('Service: Saving appointments to storage:', appointments);
    const success = await storeData(APPOINTMENTS_KEY, appointments);
    
    if (success) {
      console.log('Service: Successfully saved appointment');
    } else {
      console.error('Service: Failed to save appointment');
    }
    
    return success;
  } catch (error) {
    console.error('Error adding appointment:', error);
    throw error;
  }
};

// Save all appointments (utility function)
export const saveAppointments = async (appointments: Appointment[]): Promise<boolean> => {
  try {
    console.log('Service: Saving all appointments:', appointments);
    const success = await storeData(APPOINTMENTS_KEY, appointments);
    
    if (success) {
      console.log('Service: Successfully saved all appointments');
    } else {
      console.error('Service: Failed to save all appointments');
    }
    
    return success;
  } catch (error) {
    console.error('Error saving appointments:', error);
    return false;
  }
};

// Update an existing appointment
export const updateAppointment = async (
  id: string, 
  updates: Partial<Appointment>
): Promise<Appointment> => {
  try {
    console.log('Service: Updating appointment:', id, updates);
    
    const appointments = await getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    // Update the appointment
    appointments[index] = { ...appointments[index], ...updates };
    
    // Save back to storage
    const success = await saveAppointments(appointments);
    if (!success) {
      throw new Error('Failed to save appointment updates');
    }
    
    console.log('Service: Successfully updated appointment:', appointments[index]);
    return appointments[index];
  } catch (error) {
    console.error('Failed to update appointment:', error);
    throw error;
  }
};

// Cancel an appointment
export const cancelAppointment = async (id: string): Promise<boolean> => {
  try {
    console.log('Service: Cancelling appointment:', id);
    
    await updateAppointment(id, { status: 'cancelled' });
    console.log('Service: Successfully cancelled appointment');
    return true;
  } catch (error) {
    console.error('Failed to cancel appointment:', error);
    return false;
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const appointments = await getAppointments();
    const appointment = appointments.find(a => a.id === id);
    console.log(`Service: Found appointment ${id}:`, appointment);
    return appointment || null;
  } catch (error) {
    console.error('Error getting appointment by ID:', error);
    return null;
  }
};

// Get appointments by owner ID
export const getAppointmentsByOwner = async (ownerId: string): Promise<Appointment[]> => {
  try {
    const appointments = await getAppointments();
    const filtered = appointments.filter(a => a.ownerId === ownerId);
    console.log(`Service: Found ${filtered.length} appointments for owner ${ownerId}:`, filtered);
    return filtered;
  } catch (error) {
    console.error('Error getting appointments by owner:', error);
    return [];
  }
};

// Get appointments by doctor ID
export const getAppointmentsByDoctor = async (doctorId: string): Promise<Appointment[]> => {
  try {
    const appointments = await getAppointments();
    const filtered = appointments.filter(a => a.doctorId === doctorId);
    console.log(`Service: Found ${filtered.length} appointments for doctor ${doctorId}:`, filtered);
    return filtered;
  } catch (error) {
    console.error('Error getting appointments by doctor:', error);
    return [];
  }
};

// Reschedule appointment
export const rescheduleAppointment = async (
  id: string, 
  newDate: string, 
  newTime: string
): Promise<Appointment> => {
  return await updateAppointment(id, { 
    date: newDate, 
    time: newTime, 
    status: 'upcoming'
  });
};