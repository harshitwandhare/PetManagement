import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { DoctorsProvider } from './src/context/DoctorsContext';
import { AppointmentsProvider } from './src/context/AppointmentsContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <DoctorsProvider>
        <AppointmentsProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AppointmentsProvider>
      </DoctorsProvider>
    </AuthProvider>
  );
}