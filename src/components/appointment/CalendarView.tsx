import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Doctor } from '../../types/doctor';
import { useAppointments } from '../../context/AppointmentsContext';

interface CalendarViewProps {
  doctor: Doctor;
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: string) => void;
  selectedDate: string | null;
  selectedSlot: string | null;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  doctor,
  onDateSelect,
  onSlotSelect,
  selectedDate,
  selectedSlot,
}) => {
  const { appointments } = useAppointments();

  const availableDates = useMemo(() => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dateString = date.toISOString().split('T')[0];
    
    // Check if doctor has available slots for this day name
    const hasAvailableSlots = doctor.availableSlots.some(slot => 
      slot.day === dayName && slot.isAvailable
    );
    
    if (hasAvailableSlots) {
      dates.push({
        date: dateString,
        dayName,
        displayDate: date.getDate(),
        displayMonth: date.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
  }
  
  return dates;
}, [doctor.availableSlots]);

const availableSlots = useMemo(() => {
  if (!selectedDate) return [];
  
  const selectedDateObj = new Date(selectedDate);
  const dayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' });
  
  // Get doctor's available slots for this day name
  const doctorSlots = doctor.availableSlots.filter(slot => 
    slot.day === dayName && slot.isAvailable
  );
  
  // Get booked appointments for this date and doctor
  const bookedSlots = appointments
    .filter(apt => 
      apt.doctorId === doctor.id && 
      apt.date === selectedDate && 
      apt.status !== 'cancelled'
    )
    .map(apt => apt.time);
  
  // Filter out booked slots and return available ones
  return doctorSlots
    .filter(slot => !bookedSlots.includes(slot.startTime))
    .map(slot => ({
      time: slot.startTime,
      endTime: slot.endTime,
      id: slot.id,
    }));
}, [selectedDate, doctor, appointments]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.dateScrollView}
      >
        {availableDates.map((dateItem) => (
          <Pressable
            key={dateItem.date}
            style={[
              styles.dateItem,
              selectedDate === dateItem.date && styles.selectedDateItem,
            ]}
            onPress={() => {
              onDateSelect(dateItem.date);
              onSlotSelect("");
            }}
          >
            <Text style={[
              styles.dateMonth,
              selectedDate === dateItem.date && styles.selectedDateText,
            ]}>
              {dateItem.displayMonth}
            </Text>
            <Text style={[
              styles.dateNumber,
              selectedDate === dateItem.date && styles.selectedDateText,
            ]}>
              {dateItem.displayDate}
            </Text>
            <Text style={[
              styles.dayName,
              selectedDate === dateItem.date && styles.selectedDateText,
            ]}>
              {dateItem.dayName.substring(0, 3)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {selectedDate && (
        <>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          <View style={styles.slotsContainer}>
            {availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <Pressable
                  key={slot.id}
                  style={[
                    styles.slotItem,
                    selectedSlot === slot.time && styles.selectedSlotItem,
                  ]}
                  onPress={() => onSlotSelect(slot.time)}
                >
                  <Text style={[
                    styles.slotText,
                    selectedSlot === slot.time && styles.selectedSlotText,
                  ]}>
                    {slot.time} - {slot.endTime}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.noSlotsText}>
                No available slots for this date
              </Text>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dateScrollView: {
    marginBottom: 20,
  },
  dateItem: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 70,
  },
  selectedDateItem: {
    backgroundColor: '#4A6FA5',
  },
  dateMonth: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 2,
  },
  dayName: {
    fontSize: 12,
    color: '#666',
  },
  selectedDateText: {
    color: 'white',
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotItem: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedSlotItem: {
    backgroundColor: '#4A6FA5',
    borderColor: '#4A6FA5',
  },
  slotText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedSlotText: {
    color: 'white',
  },
  noSlotsText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CalendarView;