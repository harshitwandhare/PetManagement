import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useDoctors } from '../../context/DoctorsContext';

// Add this component to your app temporarily to debug the issue
const DoctorsDebug: React.FC = () => {
  const { doctors, refreshDoctors } = useDoctors();

  const handleRefresh = async () => {
    console.log('DoctorsDebug: Refreshing doctors...');
    await refreshDoctors();
    console.log('DoctorsDebug: Refresh complete');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Doctors Debug Information</Text>
      
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh Doctors Data</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Total Doctors: {doctors.length}</Text>
      </View>

      {doctors.map((doctor, index) => (
        <View key={doctor.id} style={styles.doctorContainer}>
          <Text style={styles.doctorName}>Doctor {index + 1}: {doctor.name}</Text>
          <Text style={styles.doctorInfo}>ID: {doctor.id}</Text>
          <Text style={styles.doctorInfo}>Location: {doctor.location}</Text>
          <Text style={styles.doctorInfo}>Specializations: {doctor.specialization.join(', ')}</Text>
          <Text style={styles.doctorInfo}>Total Slots: {doctor.availableSlots.length}</Text>
          
          <View style={styles.slotsByDay}>
            <Text style={styles.slotsDayTitle}>Slots by Day:</Text>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
              const daySlots = doctor.availableSlots.filter(slot => slot.day === day);
              const availableSlots = daySlots.filter(slot => slot.isAvailable);
              
              return (
                <View key={day} style={styles.daySlotInfo}>
                  <Text style={styles.dayName}>{day}:</Text>
                  <Text style={styles.slotCount}>
                    {daySlots.length} total ({availableSlots.length} available)
                  </Text>
                  {daySlots.length > 0 && (
                    <Text style={styles.slotTimes}>
                      Times: {daySlots.map(s => s.startTime).join(', ')}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.rawSlots}>
            <Text style={styles.rawSlotsTitle}>Raw Slot Data:</Text>
            {doctor.availableSlots.map((slot, slotIndex) => (
              <View key={slot.id} style={styles.slotItem}>
                <Text style={styles.slotText}>
                  {slotIndex + 1}. {slot.day} {slot.startTime}-{slot.endTime} 
                  ({slot.isAvailable ? 'Available' : 'Booked'})
                </Text>
                <Text style={styles.slotId}>ID: {slot.id}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {doctors.length === 0 && (
        <View style={styles.noData}>
          <Text style={styles.noDataText}>No doctors found in storage</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#4A6FA5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  doctorContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  doctorInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  slotsByDay: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  slotsDayTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  daySlotInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    width: 70,
  },
  slotCount: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  slotTimes: {
    fontSize: 10,
    color: '#888',
    fontStyle: 'italic',
  },
  rawSlots: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  rawSlotsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  slotItem: {
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ffeaa7',
  },
  slotText: {
    fontSize: 12,
    color: '#856404',
  },
  slotId: {
    fontSize: 10,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  noData: {
    alignItems: 'center',
    padding: 32,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default DoctorsDebug;