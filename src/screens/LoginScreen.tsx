// src/screens/LoginScreen.tsx
import { saveToken } from '../utils/TokenManager'; // Importar arriba
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UserService from '../services/UserService';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  RecoverCredentials: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const colorScheme = useColorScheme();

  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [matriculaError, setMatriculaError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isDark = colorScheme === 'dark';

  const validateAndLogin = async () => {
    let valid = true;
    setMatriculaError('');
    setPasswordError('');

    // Validar matrícula (ejemplo: debe iniciar con 'zS' + 8 dígitos)
    if (!/^zS\d{8}$/i.test(matricula)) {
      setMatriculaError('La matrícula debe iniciar con "zS" seguido de 8 dígitos.');
      valid = false;
    }
    if (password.length < 6 || password.length > 15) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres y menos de 15');
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await UserService.loginUser(matricula, password); // Llamada a API real
      if (response?.token) {
        await saveToken(response.token); // Guardar token en almacenamiento local
        Alert.alert('Login exitoso', `Bienvenido ${matricula}!`);
        navigation.replace('Home');
      } else {
        Alert.alert('Credenciales inválidas', response?.message || 'Verifica tus datos');
      }
    } catch (err) {
      console.error('Error en login:', err);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión. Intenta más tarde.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
          Iniciar Sesión
        </Text>

        <TextInput
          placeholder="Matrícula (ej. ZS24123456)"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          value={matricula}
          onChangeText={setMatricula}
          autoCapitalize="characters"
          keyboardType="default"
          maxLength={10}
          testID="matriculaInput"
        />
        {matriculaError ? <Text style={styles.errorText}>{matriculaError}</Text> : null}

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          testID="passwordInput"
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity style={styles.forgotContainer} onPress={() => navigation.navigate('RecoverCredentials')}>
          <Text style={[styles.forgotText, isDark ? styles.textLight : styles.textDark]}>
            ¿Olvidaste tus credenciales?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={validateAndLogin} testID="loginButton">
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={[isDark ? styles.textLight : styles.textDark]}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  lightBg: {
    backgroundColor: '#fff',
  },
  darkBg: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
    alignSelf: 'center',
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
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  loginButton: {
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
  loginButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#2f855a',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
