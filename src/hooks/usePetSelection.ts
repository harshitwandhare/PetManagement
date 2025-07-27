import { useState } from 'react';

export const usePetSelection = () => {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectPet = (petId: string) => {
    setSelectedPetId(petId === selectedPetId ? null : petId);
  };

  return {
    selectedPetId,
    selectPet,
    isPetSelected: (petId: string) => petId === selectedPetId,
  };
};