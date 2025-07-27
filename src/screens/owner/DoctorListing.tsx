import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { globalStyles } from '../../constants/styles';
import DoctorCard from '../../components/doctor/DoctorCard';
import { useDoctors } from '../../context/DoctorsContext';
import FilterModal from '../../components/owner/FilterModal';
import { SPECIALIZATIONS } from '../../constants/diseases';
import { StackNavigationProp } from '@react-navigation/stack';
import { OwnerStackParamList } from '../../navigation/types';
import { Specialization } from '../../types/doctor';

type DoctorListingNavigationProp = StackNavigationProp<
  OwnerStackParamList,
  'DoctorListing'
>;

interface DoctorListingProps {
  navigation: DoctorListingNavigationProp;
}

const DoctorListing: React.FC<DoctorListingProps> = ({ navigation }) => {
  const { doctors } = useDoctors();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);

  const filteredDoctors = selectedSpecialization
    ? doctors.filter(doctor => doctor.specialization.includes(selectedSpecialization))
    : doctors;

  return (
    <View style={globalStyles.container}>
      <View style={styles.filterContainer}>
        <Button
          title="Filter"
          onPress={() => setFilterModalVisible(true)}
        />
        {selectedSpecialization && (
          <Text style={styles.filterText}>Filtering by: {selectedSpecialization}</Text>
        )}
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DoctorCard 
            doctor={item} 
            onPress={() => navigation.navigate('BookAppointment', { doctorId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No doctors found</Text>
        }
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        specializations={SPECIALIZATIONS}
        selectedSpecialization={selectedSpecialization}
        onSelectSpecialization={setSelectedSpecialization}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filterText: {
    color: '#666',
    fontStyle: 'italic',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default DoctorListing;