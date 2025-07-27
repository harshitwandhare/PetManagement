import React, { useState, useEffect, useMemo } from 'react';
import { 
  Text, 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  ActivityIndicator 
} from 'react-native';
import { globalStyles } from '../../constants/styles';
import { DAYS_OF_WEEK, SPECIALIZATIONS } from '../../constants/diseases';
import { useDoctors } from '../../context/DoctorsContext';
import Checkbox from '../../components/common/Checkbox';
import TimeSlotPicker from '../../components/appointment/TimeSlotPicker';
import type { Specialization } from '../../types/doctor';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type ScheduleSetupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ScheduleSetup'
>;

interface ScheduleSetupProps {
  navigation: ScheduleSetupScreenNavigationProp;
}

const ScheduleSetup = ({ navigation }: ScheduleSetupProps) => {
  const { doctors, updateDoctor } = useDoctors();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>({});
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Get current doctor or initialize with default
const currentDoctor = useMemo(() => {
  return doctors[0] || {
    id: '1',
    name: 'Dr. Harshit',
    specialization: [],
    location: 'Navi Mumbai',
    rating: 4.5,
    availableSlots: [],
  };
}, [doctors]);

  // Initialize with doctor's existing schedule
  useEffect(() => {
    if (currentDoctor) {
      setSpecializations(currentDoctor.specialization);
      
      // Group existing slots by day
      const slotsByDay: Record<string, string[]> = {};
      currentDoctor.availableSlots.forEach(slot => {
        if (!slotsByDay[slot.day]) {
          slotsByDay[slot.day] = [];
        }
        slotsByDay[slot.day].push(slot.startTime);
      });
      
      setSelectedSlots(slotsByDay);
      setSelectedDays(Object.keys(slotsByDay));
    }
  }, [currentDoctor]);

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

 const handleSave = async () => {
  try {
    setIsSaving(true);
    setSaveError(null);
    
    // Create slots with proper structure
    const slots = selectedDays.flatMap(day => 
      (selectedSlots[day] || []).map(time => ({
        id: `${day}-${time.replace(':', '')}`,
        day,
        date: day, // Store the day name for filtering
        startTime: time,
        endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
        isAvailable: true,
      }))
    );

    await updateDoctor(currentDoctor.id, {
      specialization: specializations,
      availableSlots: slots,
    });
    
    setSaveSuccess(true);
    setTimeout(() => navigation.goBack(), 2000);
  } catch (error) {
    setSaveError(error instanceof Error ? error.message : 'Failed to save schedule');
  } finally {
    setIsSaving(false);
  }
};

  return (
    <ScrollView 
      style={[globalStyles.container, styles.container]}
      contentContainerStyle={styles.contentContainer}
    >
      {isSaving && (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="small" color="#4A6FA5" />
          <Text style={styles.feedbackText}>Saving your schedule...</Text>
        </View>
      )}

      {saveSuccess && (
        <View style={[styles.feedbackContainer, styles.successFeedback]}>
          <Text style={styles.feedbackText}>✓ Schedule saved successfully!</Text>
        </View>
      )}

      {saveError && (
        <View style={[styles.feedbackContainer, styles.errorFeedback]}>
          <Text style={styles.feedbackText}>{saveError}</Text>
        </View>
      )}

      <Text style={[globalStyles.title, styles.title]}>Set Up Your Schedule</Text>
      
      <View style={styles.section}>
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
      </View>

      <View style={styles.section}>
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

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={styles.buttonText}>Save Schedule</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  feedbackContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  successFeedback: {
    backgroundColor: '#E8F5E9',
  },
  errorFeedback: {
    backgroundColor: '#FFEBEE',
  },
  feedbackText: {
    fontSize: 14,
  },
  container: {
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    color: '#4A6FA5',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  button: {
    backgroundColor: '#4A6FA5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ScheduleSetup;