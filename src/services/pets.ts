// services/pets.ts
import { Pet } from '../types/pet';
import { storeData, getData } from './storage';

const PETS_KEY = (ownerId: string) => `pets-${ownerId}`;

export const getPets = async (ownerId: string): Promise<Pet[]> => {
  try {
    if (!ownerId) {
      console.warn('getPets: No owner ID provided');
      return [];
    }
    
    const key = PETS_KEY(ownerId);
    console.log('getPets: Fetching pets for owner:', ownerId, 'with key:', key);
    
    const pets = await getData<Pet[]>(key);
    const result = pets || [];
    
    console.log('getPets: Retrieved pets from storage:', result);
    return result;
  } catch (error) {
    console.error('getPets: Error retrieving pets:', error);
    return [];
  }
};

export const savePets = async (ownerId: string, pets: Pet[]): Promise<boolean> => {
  try {
    if (!ownerId) {
      console.error('savePets: No owner ID provided');
      return false;
    }
    
    const key = PETS_KEY(ownerId);
    console.log('savePets: Saving pets for owner:', ownerId, 'with key:', key, 'pets:', pets);
    
    const success = await storeData(key, pets);
    
    if (success) {
      console.log('savePets: Successfully saved pets');
    } else {
      console.error('savePets: Failed to save pets');
    }
    
    return success;
  } catch (error) {
    console.error('savePets: Error saving pets:', error);
    return false;
  }
};

export const addPet = async (ownerId: string, pet: Pet): Promise<boolean> => {
  try {
    console.log('addPet: Adding pet for owner:', ownerId, 'pet:', pet);
    
    const pets = await getPets(ownerId);
    
    // Check for duplicate pet names for the same owner
    const existingPet = pets.find(p => 
      p.name.toLowerCase() === pet.name.toLowerCase() && 
      p.ownerId === ownerId
    );
    
    if (existingPet) {
      console.warn('addPet: Pet with same name already exists:', pet.name);
      throw new Error(`A pet named "${pet.name}" already exists`);
    }
    
    pets.push(pet);
    const success = await savePets(ownerId, pets);
    
    if (success) {
      console.log('addPet: Successfully added pet');
    } else {
      console.error('addPet: Failed to add pet');
    }
    
    return success;
  } catch (error) {
    console.error('addPet: Error adding pet:', error);
    throw error;
  }
};

export const updatePet = async (ownerId: string, petId: string, updates: Partial<Pet>): Promise<boolean> => {
  try {
    console.log('updatePet: Updating pet:', petId, 'for owner:', ownerId, 'updates:', updates);
    
    const pets = await getPets(ownerId);
    const petIndex = pets.findIndex(p => p.id === petId);
    
    if (petIndex === -1) {
      console.error('updatePet: Pet not found:', petId);
      throw new Error(`Pet with ID ${petId} not found`);
    }
    
    // Ensure the pet belongs to the correct owner
    if (pets[petIndex].ownerId !== ownerId) {
      console.error('updatePet: Pet does not belong to owner:', petId, ownerId);
      throw new Error('Pet does not belong to this owner');
    }
    
    pets[petIndex] = { ...pets[petIndex], ...updates };
    const success = await savePets(ownerId, pets);
    
    if (success) {
      console.log('updatePet: Successfully updated pet');
    } else {
      console.error('updatePet: Failed to update pet');
    }
    
    return success;
  } catch (error) {
    console.error('updatePet: Error updating pet:', error);
    throw error;
  }
};

export const deletePet = async (ownerId: string, petId: string): Promise<boolean> => {
  try {
    console.log('deletePet: Deleting pet:', petId, 'for owner:', ownerId);
    
    const pets = await getPets(ownerId);
    const petIndex = pets.findIndex(p => p.id === petId);
    
    if (petIndex === -1) {
      console.error('deletePet: Pet not found:', petId);
      throw new Error(`Pet with ID ${petId} not found`);
    }
    
    // Ensure the pet belongs to the correct owner
    if (pets[petIndex].ownerId !== ownerId) {
      console.error('deletePet: Pet does not belong to owner:', petId, ownerId);
      throw new Error('Pet does not belong to this owner');
    }
    
    const updatedPets = pets.filter(p => p.id !== petId);
    const success = await savePets(ownerId, updatedPets);
    
    if (success) {
      console.log('deletePet: Successfully deleted pet');
    } else {
      console.error('deletePet: Failed to delete pet');
    }
    
    return success;
  } catch (error) {
    console.error('deletePet: Error deleting pet:', error);
    throw error;
  }
};

export const getPetById = async (ownerId: string, petId: string): Promise<Pet | null> => {
  try {
    console.log('getPetById: Getting pet:', petId, 'for owner:', ownerId);
    
    const pets = await getPets(ownerId);
    const pet = pets.find(p => p.id === petId && p.ownerId === ownerId);
    
    console.log('getPetById: Found pet:', pet);
    return pet || null;
  } catch (error) {
    console.error('getPetById: Error getting pet by ID:', error);
    return null;
  }
};

export const getPetsByType = async (ownerId: string, petType: string): Promise<Pet[]> => {
  try {
    console.log('getPetsByType: Getting pets of type:', petType, 'for owner:', ownerId);
    
    const pets = await getPets(ownerId);
    const filtered = pets.filter(p => 
      p.type.toLowerCase() === petType.toLowerCase() && 
      p.ownerId === ownerId
    );
    
    console.log('getPetsByType: Found pets:', filtered);
    return filtered;
  } catch (error) {
    console.error('getPetsByType: Error getting pets by type:', error);
    return [];
  }
};

export const clearPetsForOwner = async (ownerId: string): Promise<boolean> => {
  try {
    console.log('clearPetsForOwner: Clearing all pets for owner:', ownerId);
    
    const success = await savePets(ownerId, []);
    
    if (success) {
      console.log('clearPetsForOwner: Successfully cleared pets');
    } else {
      console.error('clearPetsForOwner: Failed to clear pets');
    }
    
    return success;
  } catch (error) {
    console.error('clearPetsForOwner: Error clearing pets:', error);
    return false;
  }
};