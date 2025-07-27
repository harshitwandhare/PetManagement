// navigation/OwnerStack.tsx (Alternative without bottom tabs)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Pressable, Text, Alert, View } from 'react-native';
import DoctorListing from '../screens/owner/DoctorListing';
import BookAppointment from '../screens/owner/BookAppointment';
import MyAppointments from '../screens/owner/MyAppointments';
import { OwnerStackParamList } from './types';
import { useAuth } from '../context/AuthContext';


const Stack = createStackNavigator<OwnerStackParamList>();

const OwnerStack = () => {
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

  const HeaderButtons = ({ navigation, showAppointments = true }: { navigation: any, showAppointments?: boolean }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {showAppointments && (
        <Pressable
          onPress={() => navigation.navigate('MyAppointments')}
          style={{
            marginRight: 10,
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: '#FFF',
            borderRadius: 4,
          }}
        >
          <Text style={{ color: '#2E7D32', fontWeight: '600', fontSize: 12 }}>
            My Appointments
          </Text>
        </Pressable>
      )}
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
    </View>
  );

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="DoctorListing" 
        component={DoctorListing} 
        options={({ navigation }) => ({
          title: 'Find a Doctor',
          headerRight: () => <HeaderButtons navigation={navigation} />
        })} 
      />
      <Stack.Screen 
        name="BookAppointment" 
        component={BookAppointment} 
        options={({ navigation }) => ({
          title: 'Booking Page',
          headerRight: () => <HeaderButtons navigation={navigation} />
        })} 
      />
      <Stack.Screen 
        name="MyAppointments" 
        component={MyAppointments} 
        options={({ navigation }) => ({
          title: 'My Appointments',
          headerRight: () => <HeaderButtons navigation={navigation} showAppointments={false} />
        })} 
      />
    </Stack.Navigator>
  );
};

export default OwnerStack;