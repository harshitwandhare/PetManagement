import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { globalStyles } from '../../constants/styles';

const Input = (props: TextInputProps) => {
  return (
    <TextInput 
      style={[globalStyles.input, props.style]}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

export default Input;