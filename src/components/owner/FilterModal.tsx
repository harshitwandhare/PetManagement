import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { globalStyles } from '../../constants/styles';
import { Specialization } from '../../types/doctor';


interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  specializations: Specialization[];
  selectedSpecialization: Specialization | null;
  onSelectSpecialization: (spec: Specialization | null) => void;
}

const FilterModal = ({
  visible,
  onClose,
  specializations,
  selectedSpecialization,
  onSelectSpecialization,
}: FilterModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={globalStyles.title}>Filter by Specialization</Text>
          
          <FlatList
            data={specializations}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterItem,
                  selectedSpecialization === item && styles.selectedFilterItem
                ]}
                onPress={() => 
                  onSelectSpecialization(
                    selectedSpecialization === item ? null : item
                  )
                }
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={globalStyles.button}>
            <Button title="Apply Filters" onPress={onClose} color="white" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  filterItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedFilterItem: {
    backgroundColor: '#e6f2ff',
  },
});

export default FilterModal;