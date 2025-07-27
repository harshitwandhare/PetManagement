// navigation/DoctorStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Pressable, Text, Alert } from 'react-native';
import DoctorDashboard from '../screens/doctor/DoctorDashboard';
import ScheduleSetup from '../screens/doctor/ScheduleSetup';
import DoctorAppointments from '../screens/doctor/DoctorAppointments';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const DoctorStack = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const LogoutButton = () => (
    <Pressable
      onPress={handleLogout}
      style={{
        marginRight: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#DC3545',
        borderRadius: 4,
      }}
    >
      <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>
        Logout
      </Text>
    </Pressable>
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A6FA5', // Primary blue
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => <LogoutButton />,
      }}
    >
      <Stack.Screen 
        name="DoctorDashboard" 
        component={DoctorDashboard} 
        options={{ title: 'Dashboard' }} 
      />
      <Stack.Screen 
        name="ScheduleSetup" 
        component={ScheduleSetup} 
        options={{ title: 'Set Up Schedule' }} 
      />
      <Stack.Screen 
        name="DoctorAppointments" 
        component={DoctorAppointments} 
        options={{ title: 'My Appointments' }} 
      />
    </Stack.Navigator>
  );
};

export default DoctorStack;