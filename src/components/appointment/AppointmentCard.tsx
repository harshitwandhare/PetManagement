// components/appointment/AppointmentCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Appointment } from '../../types/appointment';
import { globalStyles } from '../../constants/styles';

interface AppointmentCardProps {
  appointment: Appointment;
  view: 'owner' | 'doctor';
  onPress?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, view, onPress }) => {
  console.log('Rendering AppointmentCard:', appointment, view);
  const statusColor = {
    upcoming: '#FFA500',
    completed: '#4CAF50',
    cancelled: '#F44336'
  }[appointment.status];

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[globalStyles.card, styles.card]}
    >
      {view === 'owner' ? (
        <>
          <Text style={styles.title}>Dr. {appointment.doctorName}</Text>
          <Text style={styles.subtitle}>{appointment.petName}</Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>{appointment.petName}</Text>
          <Text style={styles.subtitle}>Owner: {appointment.ownerName}</Text>
        </>
      )}
      
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>{new Date(appointment.date).toLocaleDateString()}</Text>
        <Text style={styles.detailText}>•</Text>
        <Text style={styles.detailText}>{appointment.time}</Text>
      </View>
      
      <Text style={styles.reason}>{appointment.reason}</Text>
      
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{appointment.status.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginRight: 8,
  },
  reason: {
    fontSize: 15,
    marginBottom: 8,
    color: '#333',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AppointmentCard;