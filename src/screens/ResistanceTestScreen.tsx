// src/screens/ResistanceTestScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';

type ResistanceTestScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Resistance'
>;

/**
 * Rubrica para puntaje de resistencia:
 * Velocidad = distancia / tiempo (m/s)
 * - <2 m/s: muy pobre        => 0
 * - 2–3   m/s: bajo          => 1–3
 * - 3–4   m/s: promedio      => 4–6
 * - 4–6   m/s: bueno         => 7–9
 * - ≥6    m/s: excelente     => 10
 */
function computeResistanceScore(distance: number, time: number): number {
  const speed = distance / time;
  if (speed >= 6) return 10;
  if (speed >= 4) return Math.round(((speed - 4) / 2) * 2) + 7;
  if (speed >= 3) return Math.round((speed - 3) * 2) + 4;
  if (speed >= 2) return Math.round((speed - 2) * 2) + 1;
  return 0;
}

const ResistanceTestScreen = ({ navigation, route }: ResistanceTestScreenProps) => {
  const { onFinish } = route.params;

  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStopped, setHasStopped] = useState(false);
  const [distance, setDistance] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_SPEED = 8; // m/s plausible máximo

  // Cronómetro
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setTimer(0);
    setDistance('');
    setHasStopped(false);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setHasStopped(true);
  };

  const handleContinue = () => {
    if (!hasStopped) {
      Alert.alert('Primero detén el cronómetro', 'Pulsa "Detener" antes de continuar.');
      return;
    }
    const distNum = parseFloat(distance);
    if (isNaN(distNum) || distNum <= 0) {
      Alert.alert('Distancia inválida', 'Ingresa una distancia válida en metros.');
      return;
    }
    const speed = distNum / timer;
    if (speed > MAX_SPEED) {
      Alert.alert(
        'Datos incoherentes',
        `La distancia es muy alta para ${timer}s.\nVelocidad ≈ ${speed.toFixed(
          1
        )} m/s (> ${MAX_SPEED} m/s).`
      );
      return;
    }
    const score0to10 = computeResistanceScore(distNum, timer);
    const rawScore = score0to10 * 10;
    const finalScore = rawScore < 20 ? 20 : rawScore;

    Alert.alert(
      'Resultado registrado',
      `Distancia: ${distNum.toFixed(1)} m\nTiempo: ${timer}s\nPuntaje: ${finalScore}/100`
    );
    onFinish(finalScore);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Prueba de Resistencia</Text>
        <Text style={styles.description}>
          1) Pulsa "Empezar" para iniciar el cronómetro.{"\n"}
          2) Pulsa "Detener" para pausar y habilitar distancia.{"\n"}
          3) Ingresa metros y pulsa "Continuar".
        </Text>

        <Text style={styles.timer}>Cronómetro: {timer}s</Text>

        <TextInput
          placeholder="Distancia (m)"
          keyboardType="numeric"
          value={distance}
          onChangeText={setDistance}
          style={[
            styles.input,
            (!hasStopped || isRunning) && styles.inputDisabled,
          ]}
          editable={hasStopped && !isRunning}
        />

        {!isRunning && !hasStopped && (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Empezar</Text>
          </TouchableOpacity>
        )}

        {isRunning && (
          <TouchableOpacity style={styles.button} onPress={handleStop}>
            <Text style={styles.buttonText}>Detener</Text>
          </TouchableOpacity>
        )}

        {!isRunning && hasStopped && (
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ResistanceTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  timer: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#222',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
