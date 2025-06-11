import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  RecoverCredentials: undefined;
  Login: undefined;
};

type RecoverCredentialsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RecoverCredentials'
>;

const RecoverCredentialsScreen = () => {
  const navigation = useNavigation<RecoverCredentialsScreenNavigationProp>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const validateAndSend = () => {
    setError('');
    if (!input.trim()) {
      setError('Por favor ingresa tu correo o matrícula');
      return;
    }
    // Ejemplo simple para validar correo o matrícula
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const matriculaRegex = /^ZS\d{8}$/i;

    if (!emailRegex.test(input) && !matriculaRegex.test(input)) {
      setError('Ingresa un correo o matrícula válido');
      return;
    }

    // Aquí va la lógica para enviar correo de recuperación o reset
    Alert.alert(
      'Solicitud enviada',
      'Si el correo o matrícula existe en nuestro sistema, recibirás instrucciones para recuperar tus credenciales.'
    );

    navigation.goBack(); // Regresa a login
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
            Recuperar credenciales
          </Text>

          <Text style={[styles.instructionText, isDark ? styles.textLight : styles.textDark]}>
            Ingresa tu correo electrónico o matrícula para recibir instrucciones.
          </Text>

          <TextInput
            placeholder="Correo electrónico o Matrícula"
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            value={input}
            onChangeText={setInput}
            autoCapitalize="none"
            keyboardType="default"
            testID="recoverInput"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.sendButton} onPress={validateAndSend} testID="sendButton">
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backButtonText, isDark ? styles.textLight : styles.textDark]}>
              Volver al inicio de sesión
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RecoverCredentialsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  lightBg: {
    backgroundColor: '#fff',
  },
  darkBg: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 15,
    alignSelf: 'center',
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
  },
  textLight: {
    color: '#eee',
  },
  textDark: {
    color: '#222',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: '#f1f1f1',
    color: '#222',
  },
  inputDark: {
    backgroundColor: '#333',
    color: '#eee',
  },
  errorText: {
    color: '#e53935',
    marginBottom: 10,
    marginLeft: 4,
  },
  sendButton: {
    backgroundColor: '#2f855a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 35,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
