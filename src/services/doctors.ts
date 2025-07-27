import { storeData, getData } from './storage';
import { Doctor } from '../types/doctor';

const DOCTORS_KEY = 'doctors';

export const getDoctors = async (): Promise<Doctor[]> => {
  return await getData(DOCTORS_KEY) || [];
};

export const saveDoctors = async (doctors: Doctor[]) => {
  await storeData(DOCTORS_KEY, doctors);
};

export const getDoctorById = async (id: string): Promise<Doctor | undefined> => {
  const doctors = await getDoctors();
  return doctors.find(d => d.id === id);
};

export const updateDoctor = async (id: string, updates: Partial<Doctor>): Promise<boolean> => {
  try {
    const doctors = await getDoctors();
    const index = doctors.findIndex(d => d.id === id);
    if (index === -1) return false;
    
    doctors[index] = { ...doctors[index], ...updates };
    await saveDoctors(doctors);
    return true;
  } catch (error) {
    console.error('Failed to update doctor:', error);
    return false;
  }
};

export const deleteDoctor = async (id: string): Promise<boolean> => {
  try {
    const doctors = await getDoctors();
    const filtered = doctors.filter(d => d.id !== id);
    await saveDoctors(filtered);
    return true;
  } catch (error) {
    console.error('Failed to delete doctor:', error);
    return false;
  }
};