import React from 'react';
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
  const { cancelAppointment } = useAppointments();
  
  console.log('Rendering AppointmentCard:', appointment, view);
  const statusColor = {
    upcoming: '#FFA500',
    completed: '#4CAF50',
    cancelled: '#F44336'
  }[appointment.status];

  const handleCancel = async () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const success = await cancelAppointment(appointment.id);
              if (success) {
                Alert.alert('Success', 'Appointment has been cancelled');
              } else {
                Alert.alert('Error', 'Failed to cancel appointment');
              }
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

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
      
      <View style={styles.bottomRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{appointment.status.toUpperCase()}</Text>
        </View>
        
        {appointment.status === 'upcoming' && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AppointmentCard;