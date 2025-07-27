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

  // Helper function to get day name consistently
  const getDayName = (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Helper function to format date consistently
  const formatDateString = (date: Date): string => {
    // Ensure we're working with local time, not UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    
    console.log('=== CalendarView Date Calculation Debug ===');
    console.log('Today:', today);
    console.log('Doctor available slots:', doctor.availableSlots);
    console.log('All appointments:', appointments.filter(apt => apt.doctorId === doctor.id));
    
    for (let i = 0; i < 7; i++) { // Extended to 14 days for better testing
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Use our consistent day name function
      const dayName = getDayName(date);
      const dateString = formatDateString(date);
      
      console.log(`\n--- Checking Date ${i}: ${dateString} (${dayName}) ---`);
      console.log('Date object:', date);
      console.log('Day of week (0=Sun, 1=Mon):', date.getDay());
      
      // Get doctor's slots for this day name
      const doctorSlotsForDay = doctor.availableSlots.filter(slot => {
        const matches = slot.day === dayName && slot.isAvailable;
        console.log(`  Slot check: "${slot.day}" === "${dayName}" && ${slot.isAvailable} = ${matches}`);
        return matches;
      });
      
      console.log(`Doctor slots for ${dayName}:`, doctorSlotsForDay.map(s => `${s.startTime}-${s.endTime}`));
      
      // Get booked appointments for this specific date and doctor
      const bookedAppointmentsForDate = appointments.filter(apt => {
        const matches = apt.doctorId === doctor.id && 
                       apt.date === dateString && 
                       apt.status !== 'cancelled';
        if (matches) {
          console.log(`  Found booked appointment: ${apt.date} ${apt.time} (${apt.status})`);
        }
        return matches;
      });
      
      console.log(`Booked appointments for ${dateString}:`, bookedAppointmentsForDate.length);
      
      // Extract booked slot times
      const bookedSlotTimes = bookedAppointmentsForDate.map(apt => {
        const timeString = apt.time;
        const startTime = timeString.includes('-') ? timeString.split('-')[0] : timeString;
        console.log(`  Booked time: ${timeString} -> start: ${startTime}`);
        return startTime;
      });
      
      // Check available slots after removing booked ones
      const availableSlotsForDate = doctorSlotsForDay.filter(slot => {
        const isBooked = bookedSlotTimes.includes(slot.startTime);
        console.log(`  Slot ${slot.startTime}: ${isBooked ? 'BOOKED' : 'AVAILABLE'}`);
        return !isBooked;
      });
      
      console.log(`Available slots for ${dateString} (${dayName}):`, availableSlotsForDate.length);
      
      // Only add date if there are available slots
      if (availableSlotsForDate.length > 0) {
        dates.push({
          date: dateString,
          dayName,
          displayDate: date.getDate(),
          displayMonth: date.toLocaleDateString('en-US', { month: 'short' }),
          availableSlotCount: availableSlotsForDate.length
        });
        console.log(`✅ ADDED: ${dateString} (${dayName}) - ${availableSlotsForDate.length} slots`);
      } else {
        console.log(`❌ SKIPPED: ${dateString} (${dayName}) - no available slots`);
      }
    }
    
    console.log('\n=== Final Results ===');
    console.log('Available dates:', dates.map(d => `${d.date} (${d.dayName}): ${d.availableSlotCount} slots`));
    
    return dates;
  }, [doctor.availableSlots, doctor.id, appointments]);

  const availableSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }
    
    // Use the same date parsing logic
    const selectedDateObj = new Date(selectedDate + 'T00:00:00'); // Force local time
    const dayName = getDayName(selectedDateObj);
    
    console.log('\n=== Slot Calculation Debug ===');
    console.log('Selected date:', selectedDate);
    console.log('Selected date object:', selectedDateObj);
    console.log('Day name:', dayName);
    
    // Get doctor's available slots for this day name
    const doctorSlots = doctor.availableSlots.filter(slot => 
      slot.day === dayName && slot.isAvailable
    );
    
    console.log('Doctor slots for', dayName, ':', doctorSlots);
    
    // Get booked appointments for this date and doctor
    const bookedAppointments = appointments.filter(apt => 
      apt.doctorId === doctor.id && 
      apt.date === selectedDate && 
      apt.status !== 'cancelled'
    );
    
    console.log('Booked appointments for this date:', bookedAppointments);
    
    // Extract booked slot times
    const bookedSlots = bookedAppointments.map(apt => {
      const timeString = apt.time;
      const startTime = timeString.includes('-') ? timeString.split('-')[0] : timeString;
      console.log(`Booked slot: ${timeString} -> ${startTime}`);
      return startTime;
    });
    
    // Filter available slots
    const availableSlots = doctorSlots
      .filter(slot => !bookedSlots.includes(slot.startTime))
      .map(slot => ({
        time: slot.startTime,
        endTime: slot.endTime,
        id: slot.id,
      }));
    
    console.log('Final available slots:', availableSlots);
    
    return availableSlots;
  }, [selectedDate, doctor, appointments]);

  // Enhanced debug info
  const todayInfo = new Date();
  const mondayInfo = (() => {
    const monday = new Date(todayInfo);
    const daysFromMonday = (monday.getDay() + 6) % 7; // Days since last Monday
    monday.setDate(monday.getDate() - daysFromMonday);
    return monday;
  })();

  const nextMondayInfo = (() => {
    const nextMonday = new Date(todayInfo);
    const daysUntilMonday = (8 - nextMonday.getDay()) % 7 || 7;
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
    return nextMonday;
  })();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Select Date</Text>
      
      {/* Enhanced Debug Info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>Doctor: {doctor.name} (ID: {doctor.id})</Text>
        <Text style={styles.debugText}>Today: {formatDateString(todayInfo)} ({getDayName(todayInfo)})</Text>
        <Text style={styles.debugText}>This Monday: {formatDateString(mondayInfo)}</Text>
        <Text style={styles.debugText}>Next Monday: {formatDateString(nextMondayInfo)}</Text>
        <Text style={styles.debugText}>Available dates found: {availableDates.length}</Text>
        <Text style={styles.debugText}>Total doctor slots: {doctor.availableSlots.length}</Text>
        <Text style={styles.debugText}>Monday slots in data: {doctor.availableSlots.filter(s => s.day === 'Monday').length}</Text>
        <Text style={styles.debugText}>Available Monday slots: {doctor.availableSlots.filter(s => s.day === 'Monday' && s.isAvailable).length}</Text>
        <Text style={styles.debugText}>Doctor's total appointments: {appointments.filter(apt => apt.doctorId === doctor.id).length}</Text>
      </View>

      {/* Date picker */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.dateScrollView}
      >
        {availableDates.length > 0 ? (
          availableDates.map((dateItem) => (
            <Pressable
              key={dateItem.date}
              style={[
                styles.dateItem,
                selectedDate === dateItem.date && styles.selectedDateItem,
              ]}
              onPress={() => {
                console.log('Date selected:', dateItem.date, dateItem.dayName);
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
              <Text style={[
                styles.slotCount,
                selectedDate === dateItem.date && styles.selectedDateText,
              ]}>
                {dateItem.availableSlotCount} slots
              </Text>
            </Pressable>
          ))
        ) : (
          <View style={styles.noSlotsContainer}>
            <Text style={styles.noSlotsText}>No available dates found</Text>
            <Text style={styles.debugText}>Check console for detailed debugging info</Text>
          </View>
        )}
      </ScrollView>

      {/* Time slots */}
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
                  onPress={() => {
                    console.log('Slot selected:', slot.time);
                    onSlotSelect(slot.time);
                  }}
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
              <View style={styles.noSlotsContainer}>
                <Text style={styles.noSlotsText}>No available slots for this date</Text>
              </View>
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
  debugContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
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
    minWidth: 80,
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
  slotCount: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
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
  noSlotsContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  noSlotsText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 16,
  },
});

export default CalendarView;