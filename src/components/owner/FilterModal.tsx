import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
          <Text style={styles.modalTitle}>Filter by Specialization</Text>
          
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
                <Text style={selectedSpecialization === item ? styles.selectedFilterText : styles.filterText}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  selectedFilterItem: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  filterText: {
    fontSize: 16,
    color: '#34495e',
  },
  selectedFilterText: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FilterModal;