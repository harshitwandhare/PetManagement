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
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  dayHeader: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  slot: {
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
});

export default TimeSlotPicker;