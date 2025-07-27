// hooks/useDoctors.ts
import { useState, useEffect, useCallback } from 'react';
import { Doctor } from '../types/doctor';
import { getDoctors, saveDoctors } from '../services/doctors';

const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      console.log('useDoctors: Fetching doctors from storage');
      setLoading(true);
      setError(null);
      
      const data = await getDoctors();
      console.log('useDoctors: Retrieved doctors:', data);
      
      setDoctors(data);
    } catch (err) {
      console.error('useDoctors: Error fetching doctors:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDoctor = useCallback(async (newDoctor: Omit<Doctor, 'id'>) => {
    try {
      console.log('useDoctors: Adding new doctor:', newDoctor);
      setLoading(true);
      setError(null);
      
      // Create unique doctor ID based on name and timestamp
      const doctorId = `doctor-${newDoctor.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      const doctorWithId: Doctor = {
        ...newDoctor,
        id: doctorId,
      };
      
      const updatedDoctors = [...doctors, doctorWithId];
      console.log('useDoctors: Saving updated doctors:', updatedDoctors);
      
      await saveDoctors(updatedDoctors);
      setDoctors(updatedDoctors);
      
      console.log('useDoctors: Successfully added doctor:', doctorWithId);
      return doctorWithId;
    } catch (err) {
      console.error('useDoctors: Error adding doctor:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [doctors]);

  const updateDoctor = useCallback(async (id: string, updatedDoctor: Partial<Doctor>) => {
    try {
      console.log('useDoctors: Updating doctor:', id, updatedDoctor);
      setLoading(true);
      setError(null);
      
      const doctorIndex = doctors.findIndex(doctor => doctor.id === id);
      if (doctorIndex === -1) {
        throw new Error(`Doctor with ID ${id} not found`);
      }
      
      const updatedDoctors = doctors.map(doctor => 
        doctor.id === id ? { ...doctor, ...updatedDoctor } : doctor
      );
      
      console.log('useDoctors: Saving updated doctors:', updatedDoctors);
      await saveDoctors(updatedDoctors);
      setDoctors(updatedDoctors);
      
      console.log('useDoctors: Successfully updated doctor');
      return updatedDoctors.find(d => d.id === id)!;
    } catch (err) {
      console.error('useDoctors: Error updating doctor:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [doctors]);

  const deleteDoctor = useCallback(async (id: string) => {
    try {
      console.log('useDoctors: Deleting doctor:', id);
      setLoading(true);
      setError(null);
      
      const updatedDoctors = doctors.filter(doctor => doctor.id !== id);
      
      await saveDoctors(updatedDoctors);
      setDoctors(updatedDoctors);
      
      console.log('useDoctors: Successfully deleted doctor');
    } catch (err) {
      console.error('useDoctors: Error deleting doctor:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [doctors]);

  const getDoctorById = useCallback((id: string) => {
    const doctor = doctors.find(doctor => doctor.id === id);
    console.log(`useDoctors: Getting doctor by ID ${id}:`, doctor);
    return doctor;
  }, [doctors]);

  const getDoctorsBySpecialization = useCallback((specialization: string) => {
    const filtered = doctors.filter(doctor => 
      doctor.specialization.includes(specialization as any)
    );
    console.log(`useDoctors: Getting doctors by specialization ${specialization}:`, filtered);
    return filtered;
  }, [doctors]);

  const getDoctorsByLocation = useCallback((location: string) => {
    const filtered = doctors.filter(doctor => 
      doctor.location.toLowerCase().includes(location.toLowerCase())
    );
    console.log(`useDoctors: Getting doctors by location ${location}:`, filtered);
    return filtered;
  }, [doctors]);

  const getAvailableDoctors = useCallback(() => {
    const available = doctors.filter(doctor => 
      doctor.availableSlots.some(slot => slot.isAvailable)
    );
    console.log('useDoctors: Getting available doctors:', available);
    return available;
  }, [doctors]);

  const refreshDoctors = useCallback(async () => {
    console.log('useDoctors: Manual refresh triggered');
    await fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    console.log('useDoctors: Initial fetch on mount');
    fetchDoctors();
  }, [fetchDoctors]);

  // Debug effect
  useEffect(() => {
    console.log('useDoctors: State updated - doctors:', doctors.length, 'loading:', loading, 'error:', error?.message);
  }, [doctors, loading, error]);

  return {
    doctors,
    loading,
    error,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorById,
    getDoctorsBySpecialization,
    getDoctorsByLocation,
    getAvailableDoctors,
    refresh: refreshDoctors,
  };
};

export default useDoctors;