// context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { storeData, getData } from '../services/storage';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'doctor' | 'owner';
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, userType: 'doctor' | 'owner') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'currentUser';
const USERS_KEY = 'registeredUsers';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await getData<User>(USER_KEY);
      if (storedUser) {
        setCurrentUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, userType: 'doctor' | 'owner') => {
    try {
      // Get existing users
      const existingUsers = await getData<User[]>(USERS_KEY) || [];
      
      // Check if user already exists
      let user = existingUsers.find(u => u.email === email && u.userType === userType);
      
      if (!user) {
        // Create new user with consistent ID generation
        const userId = userType === 'doctor' 
          ? `doctor-${email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`
          : `owner-${email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
          
        user = {
          id: userId,
          name: userType === 'doctor' ? 'Dr.' : email.split('@')[0],
          email: email,
          userType: userType,
        };

        // Save new user to registered users
        existingUsers.push(user);
        await storeData(USERS_KEY, existingUsers);
      }

      // Store current user
      await storeData(USER_KEY, user);
      setCurrentUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login');
    }
  };

  const logout = async () => {
    try {
      await storeData(USER_KEY, null);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};