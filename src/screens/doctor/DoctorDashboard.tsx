// screens/doctor/DoctorDashboard.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { globalStyles } from '../../constants/styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type DoctorDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DoctorFlow'
>;

const DoctorDashboard = () => {
  const navigation = useNavigation<DoctorDashboardNavigationProp>();

  return (
    <View style={[globalStyles.container, styles.container]}>
      <Text style={[globalStyles.title, styles.title]}>Doctor Dashboard</Text>
      
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => navigation.navigate('ScheduleSetup')}
      >
        <Text style={styles.buttonText}>Set Up Schedule</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => navigation.navigate('DoctorAppointments')}
      >
        <Text style={styles.buttonText}>View Appointments</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA', // Light background
  },
  title: {
    color: '#4A6FA5', // Primary blue
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4A6FA5', // Primary blue
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
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

export default DoctorDashboard;