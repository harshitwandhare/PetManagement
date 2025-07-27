import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { globalStyles } from '../../constants/styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

const Button = ({ title, onPress, style, disabled = false }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[globalStyles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={globalStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.6,
  },
});

export default Button;