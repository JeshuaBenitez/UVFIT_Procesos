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
import ApiService from '../services/ApiService';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndRegister = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!apellido.trim()) newErrors.apellido = 'Campo requerido';
    if (!nombre.trim()) newErrors.nombre = 'Campo requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = 'Correo inválido';
    if (!/^zS\d{8}$/.test(matricula)) newErrors.matricula = 'Formato inválido';
    if (password.length < 6 || password.length > 16) newErrors.password = 'Contraseña inválida';
    if (password !== confirmPassword) newErrors.confirmPassword = 'No coincide';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      apellido,
      nombre,
      email,
      matricula,
      password,
      fecha_inicio: new Date().toISOString(),
    };

    try {
      const response = await ApiService.registerUser(payload);
      if (response.success) {
        Alert.alert('Registro exitoso', `Usuario ${nombre} registrado.`, [
          { text: 'OK', onPress: () => navigation.replace('Login') },
        ]);
      } else {
        Alert.alert('Error', response.message || 'No se pudo registrar el usuario.');
      }
    } catch (error: any) {
      let message = 'No se pudo conectar al servidor.';
      try {
        const errorJson = JSON.parse(error.message.split(':').slice(2).join(':').trim());
        message = errorJson.respuesta || errorJson.error || message;
      } catch (_) {}
      console.error('Error en registerUser:', error);
      Alert.alert('Error de registro', message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>Crear Cuenta</Text>

          <TextInput
            placeholder="Apellido"
            value={apellido}
            onChangeText={setApellido}
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            autoCapitalize="words"
          />
          {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}

          <TextInput
            placeholder="Nombre(s)"
            value={nombre}
            onChangeText={setNombre}
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            autoCapitalize="words"
          />
          {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

          <TextInput
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            placeholder="Matrícula (ej. zS24123456)"
            value={matricula}
            onChangeText={setMatricula}
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            autoCapitalize="none"
            maxLength={10}
          />
          {errors.matricula && <Text style={styles.errorText}>{errors.matricula}</Text>}

          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TextInput
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            secureTextEntry
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <TouchableOpacity style={styles.registerButton} onPress={validateAndRegister}>
            <Text style={styles.registerButtonText}>Crear cuenta</Text>
          </TouchableOpacity>

          <View style={styles.loginRedirect}>
            <Text style={isDark ? styles.textLight : styles.textDark}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginRedirectText}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    paddingTop: 40,
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
    marginBottom: 8,
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
    marginBottom: 6,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#2f855a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 35,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  loginRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginRedirectText: {
    color: '#2f855a',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
