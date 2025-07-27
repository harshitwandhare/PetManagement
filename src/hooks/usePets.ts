// hooks/usePets.ts
import { useState, useEffect, useCallback } from 'react';
import { Pet } from '../types/pet';
import { getPets, savePets } from '../services/pets';

export const usePets = (ownerId: string) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPets = useCallback(async () => {
    if (!ownerId) {
      console.log('usePets: No owner ID provided, skipping fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('usePets: Fetching pets for owner:', ownerId);
      let data = await getPets(ownerId);
      console.log('usePets: Retrieved pets from storage:', data);
      
      // If no pets exist, initialize with sample pets
      if (data.length === 0) {
        console.log('usePets: No pets found, creating sample pets');
        
        // Extract owner name from owner ID (format: owner-email-domain-com)
        const ownerName = ownerId.includes('owner-') 
          ? ownerId.replace('owner-', '').replace(/-/g, '.').replace(/\.com$/, '@com')
          : 'Pet Owner';
        
        const samplePets: Pet[] = [
          {
            id: `${ownerId}-pet-buddy-${Date.now()}`,
            name: 'Buddy',
            type: 'Dog',
            breed: 'Golden Retriever',
            age: 3,
            dob: '2021-05-15',
            weight: 30,
            color: 'Golden',
            gender: 'Male',
            ownerName: ownerName,
            ownerId: ownerId,
            imageUrl: 'https://cdn.britannica.com/16/234216-050-C66F8665/beagle-hound-dog.jpg?w=300',
            microchipNumber: 'ABC123456789',
            insuranceProvider: 'PetCare Plus',
            medicalHistory: [
              {
                date: '2024-01-15',
                description: 'Annual vaccination',
                type: 'vaccination',
                notes: 'Rabies, DHPP vaccines administered'
              },
              {
                date: '2023-12-10',
                description: 'Regular checkup',
                type: 'checkup',
                notes: 'Healthy weight, good condition'
              }
            ],
            currentMedications: [],
            specialNeeds: undefined,
            behavioralNotes: 'Friendly and energetic, good with children',
            lastVisitDate: '2024-01-15',
            nextVisitDate: '2025-01-15'
          },
          {
            id: `${ownerId}-pet-whiskers-${Date.now() + 1}`,
            name: 'Whiskers',
            type: 'Cat',
            breed: 'Persian',
            age: 2,
            dob: '2022-03-20',
            weight: 8,
            color: 'White',
            gender: 'Female',
            ownerName: ownerName,
            ownerId: ownerId,
            imageUrl: 'https://cdn.britannica.com/16/234216-050-C66F8665/beagle-hound-dog.jpg?w=300',
            microchipNumber: 'XYZ987654321',
            insuranceProvider: 'FelineCare',
            medicalHistory: [
              {
                date: '2024-02-01',
                description: 'Spaying surgery',
                type: 'surgery',
                notes: 'Successful spaying procedure, recovery went well'
              },
              {
                date: '2023-11-15',
                description: 'Skin condition treatment',
                type: 'illness',
                notes: 'Treated for minor skin irritation'
              }
            ],
            currentMedications: [
              {
                name: 'Omega-3 supplements',
                dosage: '1 capsule',
                frequency: 'Daily',
                startDate: '2024-02-15',
                endDate: '2024-05-15'
              }
            ],
            specialNeeds: 'Requires regular grooming due to long hair',
            behavioralNotes: 'Calm and affectionate, prefers quiet environments',
            lastVisitDate: '2024-02-01',
            nextVisitDate: '2024-08-01'
          }
        ];
        
        console.log('usePets: Saving sample pets to storage:', samplePets);
        // Save sample pets to storage
      await savePets(ownerId, samplePets);
        setPets(samplePets);
      data = samplePets; // Also return them in this call
    
      }
      
      console.log('usePets: Setting pets state:', data);
      setPets(data);
    } catch (err) {
      console.error('usePets: Error fetching pets:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  const addPet = useCallback(async (newPet: Omit<Pet, 'id'>) => {
    try {
      console.log('usePets: Adding new pet:', newPet);
      
      // Create unique pet ID with name and timestamp
      const petId = `${ownerId}-pet-${newPet.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      const petWithId: Pet = {
        ...newPet,
        id: petId,
        ownerId: ownerId, // Ensure owner ID is set
      };
      
      const updatedPets = [...pets, petWithId];
      console.log('usePets: Saving updated pets:', updatedPets);
 await savePets(ownerId, updatedPets);

      setPets(updatedPets);
      console.log('usePets: Successfully added pet:', petWithId);
      return petWithId;
    } catch (err) {
      console.error('usePets: Error adding pet:', err);
      setError(err as Error);
      throw err;
    }
  }, [pets, ownerId]);

  const updatePet = useCallback(async (petId: string, updates: Partial<Pet>) => {
    try {
      console.log('usePets: Updating pet:', petId, updates);
      
      const updatedPets = pets.map(pet => 
        pet.id === petId ? { ...pet, ...updates } : pet
      );
      
    await savePets(ownerId, updatedPets);
   
      
      setPets(updatedPets);
      console.log('usePets: Successfully updated pet');
    } catch (err) {
      console.error('usePets: Error updating pet:', err);
      setError(err as Error);
      throw err;
    }
  }, [pets, ownerId]);

  const deletePet = useCallback(async (petId: string) => {
    try {
      console.log('usePets: Deleting pet:', petId);
      
      const updatedPets = pets.filter(pet => pet.id !== petId);
 await savePets(ownerId, updatedPets);
  
      
      setPets(updatedPets);
      console.log('usePets: Successfully deleted pet');
    } catch (err) {
      console.error('usePets: Error deleting pet:', err);
      setError(err as Error);
      throw err;
    }
  }, [pets, ownerId]);

  const getPetById = useCallback((petId: string) => {
    const pet = pets.find(p => p.id === petId);
    console.log(`usePets: Getting pet by ID ${petId}:`, pet);
    return pet;
  }, [pets]);

  const refreshPets = useCallback(async () => {
    console.log('usePets: Manual refresh triggered');
    await fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    if (ownerId) {
      console.log('usePets: Owner ID changed, fetching pets for:', ownerId);
      fetchPets();
    } else {
      console.log('usePets: No owner ID, clearing pets');
      setPets([]);
      setLoading(false);
    }
  }, [fetchPets, ownerId]);

  // Debug effect
  useEffect(() => {
    console.log('usePets: State updated - pets:', pets.length, 'loading:', loading, 'error:', error?.message);
  }, [pets, loading, error]);

  return {
    pets,
    loading,
    error,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    refresh: refreshPets,
  };
};