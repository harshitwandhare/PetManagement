import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { globalStyles } from '../../constants/styles';
import { useDoctors } from '../../context/DoctorsContext';
import { useAppointments } from '../../context/AppointmentsContext';
import CalendarView from '../../components/appointment/CalendarView';
import PetSelector from '../../components/owner/PetSelector';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { OwnerStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../hooks/usePets';

type BookAppointmentNavigationProp = StackNavigationProp<
  OwnerStackParamList,
  'BookAppointment'
>;


type BookAppointmentRouteProp = RouteProp<
  OwnerStackParamList,
  'BookAppointment'
>;

interface BookAppointmentProps {
  navigation: BookAppointmentNavigationProp;
  route: BookAppointmentRouteProp;
}

const BookAppointment: React.FC<BookAppointmentProps> = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const { refreshDoctors, doctors, updateDoctor } = useDoctors();
  const { addAppointment, refreshAppointments } = useAppointments();
  const { currentUser } = useAuth();
  const { pets, loading: petsLoading } = usePets(currentUser?.id || '');
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const doctor = doctors.find(d => d.id === doctorId);

  
  const handleBookAppointment = async () => {
    if (!doctor || !selectedPetId || !selectedDate || !selectedSlot || !reason || !currentUser) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Booking appointment with:', {
        doctorId: doctor.id,
        ownerId: currentUser.id,
        petId: selectedPetId,
        date: selectedDate,
        slot: selectedSlot,
        reason
      });
      
      // Create proper time slot format
      const endTime = `${parseInt(selectedSlot.split(':')[0]) + 1}:00`;
      const timeSlot = `${selectedSlot}-${endTime}`;

      // Get pet details
      const selectedPet = pets.find(p => p.id === selectedPetId);
      if (!selectedPet) {
        throw new Error('Selected pet not found');
      }

      // Create appointment object
      const appointmentData = {
        doctorId: doctor.id,
        doctorName: doctor.name,
        petId: selectedPetId,
        petName: selectedPet.name,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        date: selectedDate,
        time: timeSlot,
        reason,
        createdAt: new Date().toISOString(),
      };

      console.log('Creating appointment with data:', appointmentData);

      // Add appointment through context (this will handle storage)
      const appointmentId = await addAppointment(appointmentData);
      console.log('Successfully created appointment with ID:', appointmentId);

      // Update doctor's availability
      const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
      console.log('Updating doctor availability for day:', dayName, 'slot:', selectedSlot);
      
      const updatedSlots = doctor.availableSlots.map(slot => 
        slot.day === dayName && slot.startTime === selectedSlot
          ? { ...slot, isAvailable: false }
          : slot
      );
      
      await updateDoctor(doctor.id, {
        availableSlots: updatedSlots
      });

      // Refresh data to ensure consistency
      console.log('Refreshing appointments and doctors data...');
      await Promise.all([
        refreshAppointments(),
        refreshDoctors(),
      ]);

      Alert.alert('Success', 'Appointment booked successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MyAppointments')
        }
      ]);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Handle loading states
  if (petsLoading) {
    return (
      <View style={[globalStyles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading pets...</Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={[globalStyles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#666' }}>Doctor not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={[globalStyles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
          Please log in to book an appointment
        </Text>
      </View>
    );
  }

  if (pets.length === 0 && !petsLoading) {
    return (
      <View style={[globalStyles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
          No pets registered. Please add a pet first.
        </Text>
      </View>
    );
  }
 const isButtonDisabled = !selectedPetId || !selectedDate || !selectedSlot || !reason.trim();
 return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={globalStyles.container}>
          <Text style={globalStyles.title}>Book with {doctor.name}</Text>
          
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoText}>
              Booking for: {currentUser.name} ({currentUser.email})
            </Text>
            <Text style={styles.userInfoSmallText}>
              User ID: {currentUser.id}
            </Text>
            <Text style={styles.userInfoSmallText}>
              {pets.length} pet{pets.length !== 1 ? 's' : ''} available
            </Text>
          </View>
          
          <PetSelector 
            pets={pets}
            selectedPetId={selectedPetId}
            onSelectPet={setSelectedPetId}
          />

          <TextInput
            style={styles.input}
            placeholder="Reason for visit"
            placeholderTextColor="#999"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
          />

          <CalendarView 
            doctor={doctor}
            onDateSelect={setSelectedDate}
            onSlotSelect={setSelectedSlot}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
          />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A6FA5" />
              <Text style={styles.loadingText}>Booking appointment...</Text>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                onPress={handleBookAppointment}
                disabled={isButtonDisabled}
              >
                <Text style={styles.buttonText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  userInfoContainer: {
    padding: 16, 
    backgroundColor: '#f5f5f5', 
    marginBottom: 16, 
    borderRadius: 8
  },
  userInfoText: {
    fontSize: 14, 
    color: '#666'
  },
  userInfoSmallText: {
    fontSize: 12, 
    color: '#888', 
    marginTop: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  loadingContainer: {
    padding: 20, 
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10, 
    color: '#666'
  },
  buttonContainer: {
    padding: 16
  },
  button: {
    backgroundColor: '#136ffaff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a9a9a9',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookAppointment;