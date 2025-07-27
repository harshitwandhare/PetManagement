# Veterinary Doctor Appointment App

A comprehensive React Native application for booking veterinary doctor appointments with features like appointment management, and doctor availability scheduling.

## User Flow Walkthrough

### First Launch Experience
1. **Login Screen**  
   - Users land on authentication screen on first launch
   - Quick login buttons for both pet owners and doctors (demo accounts)
   - Role-based routing after authentication

### Pet Owner Flow
1. **My Appointments Screen**  
   - Displays upcoming and past appointments
   - Each appointment shows:
     - Doctor details
     - Date/time
     - Status (confirmed/completed/cancelled)
   - Cancel option for upcoming appointments

2. **Book Appointment Screen**  
   - Real-time availability calendar showing:
     - Available dates (highlighted)
     - Time slots (updated dynamically)
   - Doctor filtering by:
     - Specialization
   - Multi-step booking process:
     1. Select doctor
     2. Choose available slot
     3. Confirm details

### Doctor Flow
1. **My Appointments Screen**  
   - Schedule view of all appointments
   - Color-coded by status (pending/confirmed/completed)
   - Quick action buttons for each appointment

2. **Schedule Management Screen**  
   - Daily time slot configuration:
     - Start/end times
   - Real-time updates reflected in pet owners' views

### Cancellation Flow (Both Roles)
1. **Cancellation Process**  
   - Single-tap cancellation from appointment details
   - Confirmation dialog
   - Immediate slot availability update:
    - Freed slot reappears in booking system

### Key Optimizations
- **Real-time Sync**: Appointment changes instantly update across all views
- **Intelligent Caching**: Frequently accessed data stored locally for performance
- **Role-specific UI**: Custom interfaces optimized for each user type
- **State Persistence**: Maintains all data through app restarts


## Features

- **User Authentication**: Simple login for pet owners and doctors
- **Appointment Booking**: Easy scheduling with available time slots
- **Doctor Availability**: Custom schedules days and time slots
- **Advanced Search**: Filter doctors by specialization
- **Offline Support**: Persistent data storage for uninterrupted use

## Prerequisites

- Node.js (v18 or newer)
- npm or Yarn
- React Native CLI
- Android Studio/Xcode (for emulator/simulator)
- Watchman (macOS only)

## Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/harshitwandhare/PetManagement
   cd doctor-appointment-app

   ```

2. **Install dependencies**
   
   Using npm
   npm install

   OR using Yarn
   yarn install

   Install iOS dependencies (macOS only)
   cd ios && pod install && cd ..

4. **Running the App**
   
   Start Metro Bundler
   Using npm
   npm start

   OR using Yarn
   yarn start

   Run on Android
   Using npm
   npm run android

   OR using Yarn
   yarn android

   Run on ios
   Using npm
   npm run ios

   OR using Yarn
   yarn ios


