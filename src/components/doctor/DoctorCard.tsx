import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../../constants/styles';
import { Doctor } from '../../types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

const DoctorCard = ({ doctor, onPress }: DoctorCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={globalStyles.card}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text>Specializations: {doctor.specialization.join(', ')}</Text>
      <Text>Location: {doctor.location}</Text>
      <Text>Rating: {doctor.rating}/5</Text>
      <Text>Available Slots: {doctor.availableSlots.filter(s => s.isAvailable).length}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default DoctorCard;