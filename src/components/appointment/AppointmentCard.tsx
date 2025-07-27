// components/appointment/AppointmentCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Appointment } from '../../types/appointment';
import { globalStyles } from '../../constants/styles';
import { useAppointments } from '../../context/AppointmentsContext';

interface AppointmentCardProps {
  appointment: Appointment;
  view: 'owner' | 'doctor';
  onPress?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, view, onPress }) => {
  console.log('Rendering AppointmentCard:', appointment, view);
  const { cancelAppointment } = useAppointments();
  const [isLoading, setIsLoading] = useState(false);
  
  const statusColor = {
    upcoming: '#FFA500',
    completed: '#4CAF50',
    cancelled: '#F44336'
  }[appointment.status];

  const handleCancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel this appointment with ${view === 'owner' ? `Dr. ${appointment.doctorName}` : appointment.ownerName} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const success = await cancelAppointment(appointment.id);
              if (success) {
                Alert.alert('Success', 'Appointment has been cancelled successfully.');
              } else {
                Alert.alert('Error', 'Failed to cancel appointment. Please try again.');
              }
            } catch (error) {
              console.error('Error cancelling appointment:', error);
              Alert.alert('Error', 'An error occurred while cancelling the appointment.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const showCancelButton = appointment.status === 'upcoming' && !isLoading;

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[globalStyles.card, styles.card]}
    >
      <View style={styles.cardContent}>
        <View style={styles.mainContent}>
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
        </View>

        {showCancelButton && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelAppointment}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>
                {isLoading ? 'Cancelling...' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: 1,
    marginRight: 12,
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
  actionButtons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AppointmentCard;