// src/screens/PhysicalEvaluationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Alert, useColorScheme
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import ApiService from '../services/ApiService';
import { getTokenPayload } from '../utils/TokenManager';

type PhysicalEvaluationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PhysicalEvaluationScreen'
>;

const PhysicalEvaluationScreen = () => {
  const navigation = useNavigation<PhysicalEvaluationScreenNavigationProp>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [sexo, setSexo] = useState('');
  const [cintura, setCintura] = useState('');
  const [cadera, setCadera] = useState('');
  const [zonaGrasa, setZonaGrasa] = useState('');
  const [tipoFisico, setTipoFisico] = useState('');
  const [tiempoSinEjercicio, setTiempoSinEjercicio] = useState('');
  const [metaPersonal, setMetaPersonal] = useState('');
  const [imc, setImc] = useState('');
  const [imcCategory, setImcCategory] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const p = parseFloat(peso);
    const h = parseFloat(estatura);
    if (p > 0 && h > 0) setImc((p / (h * h)).toFixed(2));
    else setImc('');
  }, [peso, estatura]);

  useEffect(() => {
    const val = parseFloat(imc);
    if (!isNaN(val)) {
      if (val < 18.5) setImcCategory('Bajo peso');
      else if (val < 25) setImcCategory('Peso normal');
      else if (val < 30) setImcCategory('Sobrepeso');
      else setImcCategory('Obesidad');
    } else setImcCategory('');
  }, [imc]);

  const validateAndContinue = async () => {
    const newErrors: { [key: string]: string } = {};
    const pNum = Number(peso);
    const eNum = Number(estatura);

    if (!peso || isNaN(pNum) || pNum < 20) newErrors.peso = 'Peso mínimo: 20 kg';
    if (!estatura || isNaN(eNum) || eNum < 1 || eNum > 3) newErrors.estatura = 'Estatura entre 1 y 3 metros';
    if (!sexo) newErrors.sexo = 'Seleccione sexo';
    if (!cintura) newErrors.cintura = 'Campo requerido';
    if (!cadera) newErrors.cadera = 'Campo requerido';
    if (!zonaGrasa) newErrors.zonaGrasa = 'Campo requerido';
    if (!tipoFisico) newErrors.tipoFisico = 'Campo requerido';
    if (!tiempoSinEjercicio) newErrors.tiempoSinEjercicio = 'Campo requerido';
    if (!metaPersonal) newErrors.metaPersonal = 'Campo requerido';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return Alert.alert('Errores', 'Corrige los campos indicados.');
    }

    try {
      const tokenPayload = await getTokenPayload();
      const id_usuario = parseInt(tokenPayload?.id);
      if (!id_usuario || isNaN(id_usuario) || id_usuario < 1) {
        throw new Error('ID de usuario no válido');
      }

      const evaluacion = {
        id_usuario,
        fecha_evaluacion: new Date().toISOString(),
        peso: parseFloat(peso),
        altura: parseFloat(estatura),
        observaciones: `Sexo: ${sexo}, IMC: ${imc}`,
      };

      const response = await ApiService.sendPhysicalEvaluation(evaluacion);
      const idEvaluacionFisica = response?.id;

      if (!idEvaluacionFisica) throw new Error('No se obtuvo ID de evaluación física');

      Alert.alert('¡Éxito!', 'Evaluación registrada correctamente.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('PruebasMenuScreen', {
            imc,
            idEvaluacionFisica,
          }),
        },
      ]);
    } catch (error) {
      console.error('❌ Error al guardar evaluación:', error);
      Alert.alert('Error', 'No se pudo guardar la evaluación.');
    }
  };

  return (
  <SafeAreaView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
        Datos Físicos
      </Text>

      <TextInput
        placeholder="Peso (kg)"
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, errors.peso && styles.errorBorder]}
        placeholderTextColor={isDark ? '#aaa' : '#666'}
      />
      {errors.peso && <Text style={styles.errorText}>{errors.peso}</Text>}

      <TextInput
        placeholder="Estatura (m)"
        keyboardType="numeric"
        value={estatura}
        onChangeText={setEstatura}
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, errors.estatura && styles.errorBorder]}
        placeholderTextColor={isDark ? '#aaa' : '#666'}
      />
      {errors.estatura && <Text style={styles.errorText}>{errors.estatura}</Text>}

      <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>IMC: {imc}</Text>
      <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Categoría: {imcCategory}</Text>

      <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Sexo</Text>
      <View style={styles.selectorContainer}>
        {['Masculino', 'Femenino', 'Otro'].map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.selectorOption,
              sexo === opt && styles.selectorOptionSelected,
            ]}
            onPress={() => setSexo(opt)}
          >
            <Text style={sexo === opt ? styles.selectorTextSelected : styles.selectorText}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.sexo && <Text style={styles.errorText}>{errors.sexo}</Text>}

      <TextInput
        placeholder="Cintura (cm)"
        keyboardType="numeric"
        value={cintura}
        onChangeText={setCintura}
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, errors.cintura && styles.errorBorder]}
        placeholderTextColor={isDark ? '#aaa' : '#666'}
      />
      {errors.cintura && <Text style={styles.errorText}>{errors.cintura}</Text>}

      <TextInput
        placeholder="Cadera (cm)"
        keyboardType="numeric"
        value={cadera}
        onChangeText={setCadera}
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, errors.cadera && styles.errorBorder]}
        placeholderTextColor={isDark ? '#aaa' : '#666'}
      />
      {errors.cadera && <Text style={styles.errorText}>{errors.cadera}</Text>}

      <TextInput
        placeholder="Zona de Grasa"
        value={zonaGrasa}
        onChangeText={setZonaGrasa}
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, errors.zonaGrasa && styles.errorBorder]}
        placeholderTextColor={isDark ? '#aaa' : '#666'}
      />
      {errors.zonaGrasa && <Text style={styles.errorText}>{errors.zonaGrasa}</Text>}

      <TextInput
        placeholder="Tipo físico"
        value={tipoFisico}
        onChangeText={setTipoFisico}
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, errors.tipoFisico && styles.errorBorder]}
        placeholderTextColor={isDark ? '#aaa' : '#666'}
      />
      {errors.tipoFisico && <Text style={styles.errorText}>{errors.tipoFisico}</Text>}

      <TextInput
        placeholder="Tiempo sin ejercicio"
        value={tiempoSinEjercicio}
        onChangeText={setTiempoSinEjercicio}
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, errors.tiempoSinEjercicio && styles.errorBorder]}
        placeholderTextColor={isDark ? '#aaa' : '#666'}
      />
      {errors.tiempoSinEjercicio && <Text style={styles.errorText}>{errors.tiempoSinEjercicio}</Text>}

      <TextInput
        placeholder="Meta personal"
        value={metaPersonal}
        onChangeText={setMetaPersonal}
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, errors.metaPersonal && styles.errorBorder]}
        placeholderTextColor={isDark ? '#aaa' : '#666'}
      />
      {errors.metaPersonal && <Text style={styles.errorText}>{errors.metaPersonal}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={validateAndContinue}>
        <Text style={styles.submitButtonText}>Continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  </SafeAreaView>
);
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  lightBg: { backgroundColor: '#fff' },
  darkBg: { backgroundColor: '#121212' },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderRadius: 8,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  inputLight: { backgroundColor: '#f1f1f1', color: '#222' },
  inputDark: { backgroundColor: '#333', color: '#eee' },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  selectorOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 8,
    marginBottom: 8,
  },
  selectorOptionSelected: {
    backgroundColor: '#2f855a',
    borderColor: '#2f855a',
  },
  selectorText: { fontSize: 14, color: '#555' },
  selectorTextSelected: { color: 'white' },
  errorText: { color: '#e53935', marginBottom: 8 },
  errorBorder: { borderColor: '#e53935', borderWidth: 1 },
  submitButton: {
    backgroundColor: '#2f855a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: 'white', fontWeight: '700', fontSize: 18 },
  textLight: { color: '#eee' },
  textDark: { color: '#222' },
});
export default PhysicalEvaluationScreen;
