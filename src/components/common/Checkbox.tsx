import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  checked, 
  onToggle,
  disabled = false
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[
        styles.checkbox,
        checked && styles.checked,
        disabled && styles.disabled
      ]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[
        styles.label,
        disabled && styles.disabledText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingHorizontal: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#4A6FA5',
    borderColor: '#4A6FA5',
  },
  disabled: {
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  disabledText: {
    color: '#999',
  },
});

export default Checkbox;