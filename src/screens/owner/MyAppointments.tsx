import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl,
  Pressable 
} from 'react-native';
import { globalStyles } from '../../constants/styles';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import { useAppointments } from '../../context/AppointmentsContext';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../hooks/usePets';
import { StackNavigationProp } from '@react-navigation/stack';
import { OwnerStackParamList } from '../../navigation/types';
import { useFocusEffect } from '@react-navigation/native';

type MyAppointmentsNavigationProp = StackNavigationProp<
  OwnerStackParamList,
  'MyAppointments'
>;

interface MyAppointmentsProps {
  navigation: MyAppointmentsNavigationProp;
}

const MyAppointments: React.FC<MyAppointmentsProps> = ({  }) => {
  const { 
    getAppointmentsByOwner, 
    refreshAppointments, 
    isLoading: appointmentsLoading,
    appointments: allAppointments 
  } = useAppointments();
  const { currentUser } = useAuth();
  const { pets, loading: petsLoading } = usePets(currentUser?.id || '');
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  // Add focus effect to refresh data when screen comes into view
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      
      const loadData = async () => {
        try {
          console.log('MyAppointments: Refreshing data on focus');
          await refreshAppointments();
        } catch (error) {
          console.error('Failed to refresh appointments:', error);
        }
      };

      if (isActive) {
        loadData();
      }

      return () => {
        isActive = false;
      };
    }, [refreshAppointments])
  );

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      console.log('MyAppointments: Manual refresh triggered');
      await refreshAppointments();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshAppointments]);

  // Get and sort appointments for the current user
  const appointments = useMemo(() => {
    if (!currentUser?.id) {
      console.log('MyAppointments: No current user');
      return [];
    }
    
    console.log('MyAppointments: Getting appointments for owner:', currentUser.id);
    console.log('MyAppointments: All appointments:', allAppointments);
    
    let userAppointments = [];
    
    // If you have getAppointmentsByOwner, use it
    if (getAppointmentsByOwner && typeof getAppointmentsByOwner === 'function') {
      userAppointments = getAppointmentsByOwner(currentUser.id);
    } else {
      // Otherwise, filter from all appointments using pet IDs
      const petIds = pets.map(pet => pet.id);
      userAppointments = allAppointments.filter(appointment => 
        petIds.includes(appointment.petId) || appointment.ownerId === currentUser.id
      );
    }
    
    console.log('MyAppointments: Found user appointments:', userAppointments);
    
    return [...userAppointments].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time.split('-')[0]}`);
      const dateB = new Date(`${b.date}T${b.time.split('-')[0]}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [currentUser, allAppointments, pets, getAppointmentsByOwner]);

  // Filter upcoming and past appointments
  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date();
    const upcoming = appointments.filter(apt => {
      const appointmentDateTime = new Date(`${apt.date}T${apt.time.split('-')[0]}`);
      return appointmentDateTime >= now && apt.status === 'upcoming';
    });
    
    const past = appointments.filter(apt => {
      const appointmentDateTime = new Date(`${apt.date}T${apt.time.split('-')[0]}`);
      return appointmentDateTime < now || apt.status !== 'upcoming';
    });
    
    console.log('MyAppointments: Upcoming appointments:', upcoming);
    console.log('MyAppointments: Past appointments:', past);
    
    return {
      upcomingAppointments: upcoming,
      pastAppointments: past
    };
  }, [appointments]);

  // Filter appointments based on selected tab
  const filteredAppointments = useMemo(() => {
    switch (statusFilter) {
      case 'upcoming':
        return upcomingAppointments;
      case 'past':
        return pastAppointments;
      default:
        return appointments;
    }
  }, [statusFilter, appointments, upcomingAppointments, pastAppointments]);

  // Debug logs
  useEffect(() => {
    console.log('MyAppointments: Current user:', currentUser);
    console.log('MyAppointments: All appointments in context:', allAppointments);
    console.log('MyAppointments: User appointments:', appointments);
    console.log('MyAppointments: Upcoming appointments:', upcomingAppointments);
    console.log('MyAppointments: Past appointments:', pastAppointments);
  }, [currentUser, allAppointments, appointments, upcomingAppointments, pastAppointments]);

  // Combined loading state
  const isLoading = appointmentsLoading || petsLoading || refreshing;

  if (!currentUser) {
    return (
      <View style={[globalStyles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>Please log in to view appointments</Text>
      </View>
    );
  }

  if (isLoading && !refreshing && appointments.length === 0) {
    return (
      <View style={[globalStyles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  if (!pets.length && !petsLoading) {
    return (
      <View style={[globalStyles.container, styles.container]}>
        <Text style={[globalStyles.title, styles.title]}>My Appointments</Text>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No pets registered. Please add a pet first.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, styles.container]}>
      <Text style={[globalStyles.title, styles.title]}>My Appointments</Text>
      
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Owner: {currentUser.name} (ID: {currentUser.id})
        </Text>
        <Text style={styles.debugText}>
          Pets: {pets.length}
        </Text>
        {/* <Text style={styles.debugText}>
          Total appointments in system: {allAppointments.length}
        </Text> */}
        <Text style={styles.debugText}>
          My appointments: {appointments.length}
        </Text>
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {upcomingAppointments.length} upcoming, {pastAppointments.length} past
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterButton, statusFilter === 'upcoming' && styles.activeFilter]}
          onPress={() => setStatusFilter('upcoming')}
        >
          <Text style={[styles.filterText, statusFilter === 'upcoming' && styles.activeFilterText]}>
            Upcoming ({upcomingAppointments.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, statusFilter === 'past' && styles.activeFilter]}
          onPress={() => setStatusFilter('past')}
        >
          <Text style={[styles.filterText, statusFilter === 'past' && styles.activeFilterText]}>
            Past ({pastAppointments.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, statusFilter === 'all' && styles.activeFilter]}
          onPress={() => setStatusFilter('all')}
        >
          <Text style={[styles.filterText, statusFilter === 'all' && styles.activeFilterText]}>
            All ({appointments.length})
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredAppointments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AppointmentCard 
            appointment={item} 
            view="owner" 
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4A6FA5']}
            tintColor="#4A6FA5"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#4A6FA5" />
            ) : (
              <>
                <Text style={styles.emptyText}>No {statusFilter} appointments</Text>
                <Text style={styles.emptySubtext}>
                  {statusFilter === 'upcoming' 
                    ? 'Tap "Find a Doctor" to book your first appointment' 
                    : 'No past appointments found'}
                </Text>
              </>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#4A6FA5',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
  },
  debugContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  debugText: {
    fontSize: 12,
    color: '#1976D2',
    marginBottom: 2,
  },
  summaryContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilter: {
    borderBottomColor: '#4A6FA5',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#4A6FA5',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default MyAppointments;