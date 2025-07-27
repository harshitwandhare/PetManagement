import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Doctor } from '../types/doctor';
import { getDoctors, saveDoctors } from '../services/doctors';

interface DoctorsContextType {
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<string>;
  updateDoctor: (
    id: string,
    updatedDoctor: Partial<Doctor>,
  ) => Promise<boolean>;
  deleteDoctor: (id: string) => Promise<boolean>;
  getDoctorById: (id: string) => Doctor | undefined;
  
  isLoading: boolean;
  error: Error | null;
  refreshDoctors: () => Promise<void>;
}

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined);

export const DoctorsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshDoctors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedDoctors = await getDoctors();
      console.log('DoctorsContext: Loaded doctors:', loadedDoctors);
      setDoctors(loadedDoctors);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load doctors'),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeDoctors = async () => {
      try {
        setIsLoading(true);
        let loadedDoctors = await getDoctors();

        // Initialize with sample data if empty
        if (loadedDoctors.length === 0) {
          // Use consistent ID format that matches AuthContext
          const drEmail = 'doctor@test.com';
          const drId = `doctor-${drEmail.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

          console.log('DoctorsContext: Creating sample doctor with ID:', drId);

          const sampleDoctors: Doctor[] = [
            {
              id: drId, // This will be 'doctor-doctor-test-com'
              name: 'Dr. Harshit',
              specialization: ['general', 'skin'],
              location: 'Navi Mumbai',
              rating: 4.5,
              availableSlots: [
                {
                  id: 'Monday-0900',
                  day: 'Monday',
                  date: 'Monday', // Store day name for filtering
                  startTime: '09:00',
                  endTime: '10:00',
                  isAvailable: true,
                },
                {
                  id: 'Monday-1000',
                  day: 'Monday',
                  date: 'Monday',
                  startTime: '10:00',
                  endTime: '11:00',
                  isAvailable: true,
                },
                {
                  id: 'Monday-1100',
                  day: 'Monday',
                  date: 'Monday',
                  startTime: '11:00',
                  endTime: '12:00',
                  isAvailable: true,
                },
                {
                  id: 'Tuesday-0900',
                  day: 'Tuesday',
                  date: 'Tuesday',
                  startTime: '09:00',
                  endTime: '10:00',
                  isAvailable: true,
                },
                {
                  id: 'Tuesday-1000',
                  day: 'Tuesday',
                  date: 'Tuesday',
                  startTime: '10:00',
                  endTime: '11:00',
                  isAvailable: true,
                },
                {
                  id: 'Wednesday-0900',
                  day: 'Wednesday',
                  date: 'Wednesday',
                  startTime: '09:00',
                  endTime: '10:00',
                  isAvailable: true,
                },
                {
                  id: 'Wednesday-1000',
                  day: 'Wednesday',
                  date: 'Wednesday',
                  startTime: '10:00',
                  endTime: '11:00',
                  isAvailable: true,
                },
                {
                  id: 'Thursday-0900',
                  day: 'Thursday',
                  date: 'Thursday',
                  startTime: '09:00',
                  endTime: '10:00',
                  isAvailable: true,
                },
                {
                  id: 'Friday-0900',
                  day: 'Friday',
                  date: 'Friday',
                  startTime: '09:00',
                  endTime: '10:00',
                  isAvailable: true,
                },
              ],
            },
            {
              id: 'doctor-2',
              name: 'Dr. Test',
              specialization: ['dental', 'behavioral'],
              location: 'Germany',
              rating: 4.8,
              availableSlots: [],
            },
          ];
          
          console.log('DoctorsContext: Saving sample doctors:', sampleDoctors);
          await saveDoctors(sampleDoctors);
          loadedDoctors = sampleDoctors;
        }

        console.log('DoctorsContext: Final doctors loaded:', loadedDoctors);
        setDoctors(loadedDoctors);
      } catch (err) {
        console.error('DoctorsContext: Error initializing doctors:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to load doctors'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeDoctors();
  }, []);

  const addDoctor = useCallback(
    async (doctor: Omit<Doctor, 'id'>): Promise<string> => {
      try {
        setIsLoading(true);
        const newDoctor: Doctor = {
          ...doctor,
          id: Date.now().toString(),
        };
        const updatedDoctors = [...doctors, newDoctor];
        await saveDoctors(updatedDoctors);
        setDoctors(updatedDoctors);
        return newDoctor.id;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to add doctor'),
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [doctors],
  );

  const updateDoctor = useCallback(
    async (id: string, updates: Partial<Doctor>): Promise<boolean> => {
      try {
        console.log('DoctorsContext: Updating doctor', id, 'with:', updates);
        setIsLoading(true);
        
        const updatedDoctors = doctors.map(doctor =>
          doctor.id === id ? { ...doctor, ...updates } : doctor,
        );
        
        console.log('DoctorsContext: Updated doctors array:', updatedDoctors);
        
        await saveDoctors(updatedDoctors);
        setDoctors(updatedDoctors);
        
        console.log('DoctorsContext: Successfully updated doctor');
        return true;
      } catch (err) {
        console.error('DoctorsContext: Error updating doctor:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to update doctor'),
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [doctors],
  );

  const deleteDoctor = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        const updatedDoctors = doctors.filter(doctor => doctor.id !== id);
        await saveDoctors(updatedDoctors);
        setDoctors(updatedDoctors);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to delete doctor'),
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [doctors],
  );

  const getDoctorById = useCallback(
    (id: string) => {
      const doctor = doctors.find(doctor => doctor.id === id);
      console.log('DoctorsContext: Getting doctor by ID', id, ':', doctor);
      return doctor;
    },
    [doctors],
  );

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        getDoctorById,
        isLoading,
        error,
        refreshDoctors,
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
};

export const useDoctors = (): DoctorsContextType => {
  const context = useContext(DoctorsContext);
  if (!context) {
    throw new Error('useDoctors must be used within a DoctorsProvider');
  }
  return context;
};