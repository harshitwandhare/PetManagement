
export type RootStackParamList = {
  Login: undefined;
  DoctorFlow: undefined;
  OwnerFlow: undefined;
  DoctorDashboard: undefined;
  ScheduleSetup: undefined;
  DoctorAppointments: undefined;
  BookAppointment: { doctorId: string };
  MyAppointments: undefined;
  DoctorListing: undefined;
  // Add other routes as needed
};
export type OwnerStackParamList = {
  DoctorListing: undefined;
  BookAppointment: { doctorId: string };
  MyAppointments: undefined;
};

export type DoctorStackParamList = {
  DoctorDashboard: undefined;
  ScheduleSetup: undefined;
  DoctorAppointments: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}