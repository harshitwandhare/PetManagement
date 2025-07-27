import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorStack from './DoctorStack';
import OwnerStack from './OwnerStack';
import { ActivityIndicator, Text, View } from 'react-native';
import Login from '../screens/auth/Login';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { currentUser, isLoading } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          // User not logged in - show login screen
          <Stack.Screen name="Login" component={Login} />
        ) : currentUser.userType === 'doctor' ? (
          // Doctor logged in - show doctor stack
          <Stack.Screen name="DoctorFlow" component={DoctorStack} />
        ) : (
          // Owner logged in - show owner stack
          <Stack.Screen name="OwnerFlow" component={OwnerStack} />
        )}
      </Stack.Navigator>
  );
};

export default AppNavigator;