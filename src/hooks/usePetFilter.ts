import { useMemo } from 'react';
import { Pet } from '../types/pet';

export const usePetFilter = (pets: Pet[], searchTerm: string, filters: {
  type?: string;
  minAge?: number;
  maxAge?: number;
}) => {
  return useMemo(() => {
    return pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pet.breed?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !filters.type || pet.type === filters.type;
      const matchesAge = (
        (!filters.minAge || pet.age >= filters.minAge) &&
        (!filters.maxAge || pet.age <= filters.maxAge)
      );
      
      return matchesSearch && matchesType && matchesAge;
    });
  }, [pets, searchTerm, filters]);
};