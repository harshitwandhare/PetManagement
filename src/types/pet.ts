export interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;          // Important for medical context
  age: number;
  dob?: string;           // Date of birth (ISO format)
  weight?: number;        // Important for medication dosing
  color?: string;
  ownerName: string;
   gender?: string;
  ownerId: string;
  imageUrl?: string;      // For pet identification
  microchipNumber?: string;
  insuranceProvider?: string;
  medicalHistory?: {
    date: string;         // ISO format
    description: string;
    type: 'vaccination' | 'surgery' | 'illness' | 'checkup' | 'other';
    notes?: string;
  }[];
  currentMedications?: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;    // ISO format
    endDate?: string;     // ISO format
  }[];
  specialNeeds?: string;
  behavioralNotes?: string;
  lastVisitDate?: string; // ISO format
  nextVisitDate?: string; // ISO format
}