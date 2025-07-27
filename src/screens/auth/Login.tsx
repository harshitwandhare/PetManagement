// screens/auth/Login.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  Alert,
  ActivityIndicator, 
  SafeAreaView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { globalStyles } from '../../constants/styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'doctor' | 'owner'>('owner');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }

    try {
      setLoading(true);
      await login(email, userType);
      // Navigation will happen automatically via App.tsx when currentUser changes
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Quick login buttons for testing
  const quickLogin = (type: 'doctor' | 'owner') => {
    const testEmail = type === 'doctor' ? 'doctor@test.com' : 'owner@test.com';
    setEmail(testEmail);
    setUserType(type);
  };

  return (
      <SafeAreaView style={globalStyles.container}>
    <View style={[globalStyles.container, styles.container]}>
      <Text style={[globalStyles.title, styles.title]}>Pet Practice Login</Text>
      
      {/* Quick Login Buttons for Testing */}
      <View style={styles.quickLoginContainer}>
        <Text style={styles.quickLoginLabel}>Quick Login (for testing):</Text>
        <View style={styles.quickLoginButtons}>
          <Pressable 
            style={[styles.quickLoginButton, styles.doctorButton]} 
            onPress={() => quickLogin('doctor')}
          >
            <Text style={styles.quickLoginButtonText}>Login as Doctor</Text>
          </Pressable>
          <Pressable 
            style={[styles.quickLoginButton, styles.ownerButton]} 
            onPress={() => quickLogin('owner')}
          >
            <Text style={styles.quickLoginButtonText}>Login as Owner</Text>
          </Pressable>
        </View>
      </View>

      {/* Manual Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>User Type:</Text>
        <View style={styles.userTypeContainer}>
          <Pressable
            style={[
              styles.userTypeButton,
              userType === 'owner' && styles.userTypeButtonActive
            ]}
            onPress={() => setUserType('owner')}
          >
            <Text style={[
              styles.userTypeButtonText,
              userType === 'owner' && styles.userTypeButtonTextActive
            ]}>
              Pet Owner
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.userTypeButton,
              userType === 'doctor' && styles.userTypeButtonActive
            ]}
            onPress={() => setUserType('doctor')}
          >
            <Text style={[
              styles.userTypeButtonText,
              userType === 'doctor' && styles.userTypeButtonTextActive
            ]}>
              Doctor
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A6FA5" />
            <Text style={styles.loadingText}>Logging in...</Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
              !email.trim() && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={!email.trim()}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
        )}
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    color: '#4A6FA5',
    textAlign: 'center',
    marginBottom: 30,
  },
  quickLoginContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  quickLoginLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  quickLoginButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickLoginButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  doctorButton: {
    backgroundColor: '#4A6FA5',
  },
  ownerButton: {
    backgroundColor: '#2E7D32',
  },
  quickLoginButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 8,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    borderColor: '#4A6FA5',
    backgroundColor: '#E3F2FD',
  },
  userTypeButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  userTypeButtonTextActive: {
    color: '#4A6FA5',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#4A6FA5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonPressed: {
    opacity: 0.8,
  },
  loginButtonDisabled: {
    backgroundColor: '#CCC',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Login;