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
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<string>; // Returns new ID
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
      setDoctors(loadedDoctors);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load doctors'),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);
  // In DoctorsProvider useEffect
  useEffect(() => {
    const initializeDoctors = async () => {
      try {
        setIsLoading(true);
        let loadedDoctors = await getDoctors();

        // Initialize with sample data if empty
        if (loadedDoctors.length === 0) {
             const drEmail = 'doctor@test.com';
          const drId = `doctor-${drEmail.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`; 

          const sampleDoctors: Doctor[] = [
            {
              id: drId,
              name: 'Dr. Harshit',
              specialization: ['general', 'skin'],
              location: 'Navi Mumbai',
              rating: 4.5,
              availableSlots: [
                {
                  id: 'Monday-0900',
                  day: 'Monday',
                  date: '',
                  startTime: '09:00',
                  endTime: '10:00',
                  isAvailable: true,
                },
              ],
            },
            {
              id: '2',
              name: 'Dr. Test',
              specialization: ['dental', 'behavioral'],
              location: 'Germany',
              rating: 4.8,
              availableSlots: [],
            },
          ];
          await saveDoctors(sampleDoctors);
          loadedDoctors = sampleDoctors;
        }

        setDoctors(loadedDoctors);
      } catch (err) {
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
          id: Date.now().toString(), // Generate ID on client
        };
        const updatedDoctors = [...doctors, newDoctor];
        await saveDoctors(updatedDoctors);
        setDoctors(updatedDoctors);
        return newDoctor.id;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to add doctor'),
        );
        throw err; // Re-throw to let component handle
      } finally {
        setIsLoading(false);
      }
    },
    [doctors],
  );

  const updateDoctor = useCallback(
    async (id: string, updates: Partial<Doctor>): Promise<boolean> => {
      try {
        setIsLoading(true);
        const updatedDoctors = doctors.map(doctor =>
          doctor.id === id ? { ...doctor, ...updates } : doctor,
        );
        await saveDoctors(updatedDoctors);
        setDoctors(updatedDoctors);
        return true;
      } catch (err) {
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
      return doctors.find(doctor => doctor.id === id);
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
