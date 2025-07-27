import { Pet } from "../types/pet";

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePetForm = (pet: Omit<Pet, 'id' | 'ownerId'>): string | null => {
  if (!pet.name) return 'Pet name is required';
  if (!pet.type) return 'Pet type is required';
  if (!pet.age || pet.age <= 0) return 'Valid age is required';
  return null;
};