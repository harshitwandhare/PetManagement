export const formatAppointmentDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTimeSlot = (time: string): string => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isPastAppointment = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};