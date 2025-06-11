// src/screens/StrengthTestScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';

type StrengthTestScreenProps = NativeStackScreenProps<RootStackParamList, 'Strength'>;

// Funciones de rúbrica para cada ejercicio:
function pushUpsScore(t: number) {
  const tOpt = 20;
  const tLim = 45;
  if (t <= tOpt) return 10;
  if (t >= tLim) return 0;
  return Math.round(((tLim - t) / (tLim - tOpt)) * 10);
}

function squatsScore(t: number) {
  const tOpt = 25;
  const tLim = 50;
  if (t <= tOpt) return 10;
  if (t >= tLim) return 0;
  return Math.round(((tLim - t) / (tLim - tOpt)) * 10);
}

function pullUpsScore(t: number) {
  const tOpt = 15;
  const tLim = 40;
  if (t <= tOpt) return 10;
  if (t >= tLim) return 0;
  return Math.round(((tLim - t) / (tLim - tOpt)) * 10);
}

function dipsScore(t: number) {
  const tOpt = 20;
  const tLim = 45;
  if (t <= tOpt) return 10;
  if (t >= tLim) return 0;
  return Math.round(((tLim - t) / (tLim - tOpt)) * 10);
}

function deadliftScore(t: number) {
  const tOpt = 20;
  const tLim = 45;
  if (t <= tOpt) return 10;
  if (t >= tLim) return 0;
  return Math.round(((tLim - t) / (tLim - tOpt)) * 10);
}

const StrengthTestScreen = ({ navigation, route }: StrengthTestScreenProps) => {
  const { onFinish } = route.params;
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [scoresArray, setScoresArray] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Definimos los 5 ejercicios de fuerza, con su imagen, descrip. y reps mínimas
   * (que el usuario debe tardar al menos ese tiempo antes de pasar al siguiente).
   */
  const exercises = [
    {
      id: 1,
      name: 'Flexiones',
      repetitions: 15,
      minTime: 20, // No podrá avanzar antes de 20s
      image: require('../../assets/flexiones.jpg'),
      description:
        'Realiza 15 flexiones con el cuerpo recto y bajando hasta casi tocar el suelo con el pecho.',
      videoUrl: 'https://youtu.be/iAEM8Mx-4nM?si=G7WA40jOvJSvavef',
      scoreFunc: pushUpsScore,
    },
    {
      id: 2,
      name: 'Sentadillas',
      repetitions: 20,
      minTime: 25, // No podrá avanzar antes de 25s
      image: require('../../assets/sentadilla.jpg'),
      description:
        'Realiza 20 sentadillas bajando las rodillas hasta 90° y manteniendo la espalda recta.',
      videoUrl: 'https://youtu.be/BjixzWEw4EY?si=InGmMyuuVdcmxUqQ',
      scoreFunc: squatsScore,
    },
    {
      id: 3,
      name: 'Dominadas',
      repetitions: 10,
      minTime: 15, // No podrá avanzar antes de 15s
      image: require('../../assets/dominadas.jpg'),
      description:
        'Realiza 10 dominadas: sube tu cuerpo hasta que el mentón sobrepase la barra.',
      videoUrl: 'https://youtu.be/OLqm4HTdr34?si=cW9f9T5CDVxCbMAY',
      scoreFunc: pullUpsScore,
    },
    {
      id: 4,
      name: 'Fondos en Paralelas',
      repetitions: 12,
      minTime: 20, // No podrá avanzar antes de 20s
      image: require('../../assets/fondos.png'),
      description:
        'Realiza 12 fondos en paralelas: baja flexionando codos a 90° y empuja hacia arriba.',
      videoUrl: 'https://youtu.be/CjGPpeM_Kog?si=l7nhUIF6bVwanCtn',
      scoreFunc: dipsScore,
    },
    {
      id: 5,
      name: 'Peso Muerto con Mancuernas',
      repetitions: 12,
      minTime: 20, // No podrá avanzar antes de 20s
      image: require('../../assets/peso_muerto.png'),
      description:
        'Realiza 12 repeticiones de peso muerto con mancuernas, bajando hasta media espinilla.',
      videoUrl: 'https://youtube.com/shorts/SAdzug-v7D0?si=nv_O9MO2d2gGpt99',
      scoreFunc: deadliftScore,
    },
  ];

  const exercise = exercises[currentExerciseIndex];
  const { name, repetitions, minTime, image, description, videoUrl, scoreFunc } = exercise;

  // Cada 0.1s incrementa el timer si isRunning === true
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => +(prev + 0.1).toFixed(1));
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const openModal = () => {
    setIsRunning(false);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const openVideo = () => {
    Linking.openURL(videoUrl);
  };

  const handleStartExercise = () => {
    setTime(0);
    setIsRunning(true);
  };

  const handleNextExercise = () => {
    if (time < minTime) {
      Alert.alert(
        'Tiempo insuficiente',
        `Para ${name}, debes esperar al menos ${minTime}s antes de continuar.`
      );
      return;
    }
    // Se detiene el cronómetro
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);

    // Calculamos el puntaje 0–10 para este ejercicio
    const thisScore = scoreFunc(time);
    setScoresArray((prev) => [...prev, thisScore]);

    Alert.alert(
      'Resultado registrado',
      `Ejercicio: ${name}\nRepeticiones: ${repetitions}\nTiempo: ${time.toFixed(
        1
      )}s\nPuntaje: ${thisScore}/10`
    );

    // Avanzar al siguiente ejercicio o finalizar
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTime(0);
    } else {
      // Ya terminamos todos los ejercicios de fuerza
      // Calculamos promedio 0–10
      const sumScores = scoresArray.reduce((a, b) => a + b, thisScore);
      const avg0to10 = sumScores / exercises.length;
      // Escalamos a 0–100
      const finalStrengthScore = Math.round(avg0to10 * 10);
      onFinish(finalStrengthScore);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Prueba de Fuerza</Text>

      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{name}</Text>
        <TouchableOpacity onPress={openModal} style={styles.infoButton}>
          <Ionicons name="help-circle-outline" size={28} color="#2f855a" />
        </TouchableOpacity>
      </View>

      <Image source={image} style={styles.exerciseImage} resizeMode="contain" />
      <Text style={styles.repsText}>Repeticiones: {repetitions}</Text>
      <Text style={styles.timer}>{time.toFixed(1)}s</Text>
      <Text style={styles.minTimeText}>Tiempo mínimo: {minTime}s</Text>

      {!isRunning ? (
        <TouchableOpacity style={styles.startButton} onPress={handleStartExercise}>
          <Text style={styles.buttonText}>Empezar ejercicio</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, time < minTime && styles.buttonDisabled]}
          onPress={handleNextExercise}
          disabled={time < minTime}
        >
          <Text style={styles.buttonText}>
            {currentExerciseIndex < exercises.length - 1
              ? 'Siguiente Ejercicio'
              : 'Finalizar Prueba'}
          </Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{name}</Text>
            <Text style={styles.modalDescription}>{description}</Text>
            <TouchableOpacity onPress={openVideo} style={styles.modalLinkButton}>
              <Text style={styles.modalLinkText}>Ver video demostrativo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default StrengthTestScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  exerciseName: { fontSize: 24, fontWeight: '700', color: '#2f855a' },
  infoButton: { marginLeft: 10 },
  exerciseImage: { width: '100%', height: 200, marginBottom: 15 },
  repsText: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  timer: { fontSize: 48, fontWeight: '700', marginBottom: 8, color: '#2f855a', textAlign: 'center' },
  minTimeText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#38a169',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2f855a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2f855a',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalLinkButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  modalLinkText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  modalCloseButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalCloseText: {
    color: '#3182ce',
    fontWeight: '600',
    fontSize: 16,
  },
});
