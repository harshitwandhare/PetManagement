import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { globalStyles } from '../../constants/styles';
import { SPECIALIZATIONS, DAYS_OF_WEEK } from '../../constants/diseases';
import useDoctors from '../../hooks/useDoctors';
import Checkbox from '../common/Checkbox';
import TimeSlotPicker from './TimeSlotPicker';
import Button from '../common/Button';
import { Specialization } from '../../types/doctor';

const ScheduleEditor: React.FC = () => {
  const { doctors, updateDoctor } = useDoctors();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>({});
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const currentDoctor = doctors[0];

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleSpecialization = (spec: Specialization) => {
    setSpecializations(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleSave = () => {
    if (!currentDoctor) return;

    const slots = selectedDays.flatMap(day => 
      (selectedSlots[day] || []).map(time => ({
        id: `${day}-${time}`,
        day,
        date: day, // Adding the required date property (using day as date for now)
        startTime: time,
        endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
        isAvailable: true,
      }))
    );

    updateDoctor(currentDoctor.id, {
      specialization: specializations,
      availableSlots: slots,
    });
  };

  if (!currentDoctor) {
    return (
      <View style={globalStyles.container}>
        <Text>Doctor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Edit Availability</Text>
      
      <Text style={styles.sectionTitle}>Specializations</Text>
      <View style={styles.checkboxContainer}>
        {SPECIALIZATIONS.map(spec => (
          <Checkbox
            key={spec}
            label={spec}
            checked={specializations.includes(spec)}
            onToggle={() => toggleSpecialization(spec)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Available Days</Text>
      <View style={styles.checkboxContainer}>
        {DAYS_OF_WEEK.map(day => (
          <Checkbox
            key={day}
            label={day}
            checked={selectedDays.includes(day)}
            onToggle={() => toggleDay(day)}
          />
        ))}
      </View>

      {selectedDays.map(day => (
        <TimeSlotPicker
          key={day}
          day={day}
          selectedSlots={selectedSlots[day] || []}
          onSlotsChange={(slots) => 
            setSelectedSlots(prev => ({ ...prev, [day]: slots }))
          }
        />
      ))}

      <Button 
        title="Save Schedule" 
        onPress={handleSave} 
        style={styles.saveButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  saveButton: {
    margin: 16,
  },
});

export default ScheduleEditor;