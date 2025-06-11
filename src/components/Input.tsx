// src/components/Input.tsx

import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

// Definimos las propiedades para el campo de texto
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean; // Para contraseñas u otros campos sensibles
}

const Input = ({ value, onChangeText, placeholder, secureTextEntry }: InputProps) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry} // Si es necesario, como en un campo de contraseña
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default Input;
