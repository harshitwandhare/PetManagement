import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TIME_SLOTS } from '../../constants/diseases';

interface TimeSlotPickerProps {
  day: string;
  selectedSlots: string[];
  onSlotsChange: (slots: string[]) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  day, 
  selectedSlots, 
  onSlotsChange 
}) => {
  const toggleSlot = (slot: string) => {
    const newSlots = selectedSlots.includes(slot)
      ? selectedSlots.filter(s => s !== slot)
      : [...selectedSlots, slot];
    onSlotsChange(newSlots);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dayHeader}>{day}</Text>
      <FlatList
        horizontal
        data={TIME_SLOTS}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.slot,
              selectedSlots.includes(item) && styles.selectedSlot
            ]}
            onPress={() => toggleSlot(item)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.slotText,
              selectedSlots.includes(item) && styles.selectedSlotText
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.slotsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  dayHeader: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  slotsContainer: {
    gap: 8,
    paddingRight: 16,
  },
  slot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  selectedSlot: {
    backgroundColor: '#4A6FA5',
    borderColor: '#4A6FA5',
  },
  slotText: {
    color: '#333',
    fontSize: 14,
  },
  selectedSlotText: {
    color: '#FFF',
  },
});

export default TimeSlotPicker;