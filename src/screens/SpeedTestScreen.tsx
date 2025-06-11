// src/screens/SpeedTestScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';

type SpeedTestScreenProps = NativeStackScreenProps<RootStackParamList, 'Speed'>;

/**
 * Rubrica de velocidad en 50 m con punto intermedio:
 *  - ≤ 6 s  ⇒ 10 pts (excelente)
 *  - > 6 y ≤ 8 s ⇒ 8 pts (muy bueno)
 *  - > 8 y < 12 s ⇒ lineal de 8 a 0
 *  - ≥ 12 s ⇒ 0 pts (muy lento)
 */
function computeSpeedScore(timeSec: number): number {
  const tOpt = 6;   // tiempo para 10 pts
  const tMid = 8;   // tiempo para 8 pts
  const tLim = 12;  // tiempo para 0 pts

  if (timeSec <= tOpt) return 10;
  if (timeSec <= tMid) return 8;
  if (timeSec >= tLim) return 0;
  // si 8 < timeSec < 12, interpolar linealmente entre 8 y 0
  return Math.round(((tLim - timeSec) / (tLim - tMid)) * 8);
}

const SpeedTestScreen = ({ navigation, route }: SpeedTestScreenProps) => {
  const { onFinish } = route.params;
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0); // segundos transcurridos

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const MIN_TIME_SECONDS = 6; // no permitir confirmar antes de 6 s

  // 1) Efecto para arrancar/detener el cronómetro
  useEffect(() => {
    if (isRunning) {
      // arrancar intervalo cada 1 s
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      // detener interval y resetear timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setTimer(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleConfirmar = () => {
    if (!isRunning) {
      Alert.alert('Debes iniciar primero', 'Presiona "Iniciar" para comenzar el cronómetro.');
      return;
    }
    if (timer < MIN_TIME_SECONDS) {
      Alert.alert(
        'Tiempo insuficiente',
        `El tiempo mínimo para 50 m es de ${MIN_TIME_SECONDS} segundos.`
      );
      return;
    }
    // Calcular puntaje 0–10 y luego escalar a 0–100
    const score0to10 = computeSpeedScore(timer);
    const finalScore = score0to10 * 10;

    Alert.alert(
      'Resultado registrado',
      `Tiempo: ${timer}s\nPuntaje: ${finalScore}/100`
    );
    setIsRunning(false);
    onFinish(finalScore);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Prueba de Velocidad</Text>
        <Text style={styles.description}>
          Corre 50 m lo más rápido posible. Cuando veas “Cronómetro: X s”, presiona “Confirmar”.
        </Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Cronómetro: {timer}s</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={handleStart}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>{isRunning ? 'Corriendo...' : 'Iniciar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            (!isRunning || timer < MIN_TIME_SECONDS) && styles.buttonDisabled,
          ]}
          onPress={handleConfirmar}
          disabled={!isRunning || timer < MIN_TIME_SECONDS}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SpeedTestScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
