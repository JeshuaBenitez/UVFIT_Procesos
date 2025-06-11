// src/screens/FlexibilityTestScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Modal,
  Linking,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';

type FlexibilityTestScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Flexibility'
>;

const FlexibilityTestScreen = ({ navigation, route }: FlexibilityTestScreenProps) => {
  const { onFinish } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enteredCm, setEnteredCm] = useState('');
  const [scores, setScores] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Cuatro estiramientos con límites en cm y videos en español.
   */
  const stretches = [
    {
      id: 1,
      name: 'Estiramiento de Isquiotibiales',
      minCm: 0,
      maxCm: 45,
      image: require('../../assets/estiramiento_de_isquiotibiales.jpg'),
      description:
        'Siéntate con las piernas extendidas. Inclínate hacia adelante desde la cadera y desliza las manos lo más lejos posible sin doblar las rodillas. Mide en cm desde la punta de los pies.',
      // Video demostrativo en español
      videoUrl: 'https://youtu.be/_d7yEj2DCzU?si=lwwHuk0m97taumB3',
      scoreFunc: (x: number) => {
        const v = Math.min(Math.max(x, 0), 45);
        if (v === 0) return 0;
        if (v <= 8) {
          // 1–2 pts
          return Math.round(((v - 0) / 8) * 1) + 1;
        }
        if (v <= 17) {
          // 3–4 pts
          return Math.round(((v - 9) / 8) * 1) + 3;
        }
        if (v <= 25) {
          // 5–7 pts
          return Math.round(((v - 18) / 7) * 2) + 5;
        }
        if (v <= 34) {
          // 8–9 pts
          return Math.round(((v - 26) / 8) * 1) + 8;
        }
        return 10; // ≥35 cm
      },
    },
    {
      id: 2,
      name: 'Estiramiento en “V” Sentado',
      minCm: 0,
      maxCm: 35,
      image: require('../../assets/estiramiento_en_v_sentado.jpg'),
      description:
        'Siéntate con las piernas abiertas en V (≈90°), inclínate hacia adelante con la espalda recta y mide en cm cuánto alcanzan los dedos desde la línea media entre los tobillos.',
      // Video demostrativo en español
      videoUrl: 'https://www.youtube.com/watch?v=l5u7TLzWjLw',
      scoreFunc: (x: number) => {
        const v = Math.min(Math.max(x, 0), 35);
        if (v === 0) return 0;
        if (v <= 6) {
          // 1–2 pts
          return Math.round(((v - 0) / 6) * 1) + 1;
        }
        if (v <= 13) {
          // 3–4 pts
          return Math.round(((v - 7) / 6) * 1) + 3;
        }
        if (v <= 22) {
          // 5–7 pts
          return Math.round(((v - 14) / 8) * 2) + 5;
        }
        if (v <= 30) {
          // 8–9 pts
          return Math.round(((v - 23) / 7) * 1) + 8;
        }
        return 10; // ≥31 cm
      },
    },
    {
      id: 3,
      name: 'Flexión Lateral de Tronco',
      minCm: 0,
      maxCm: 30,
      image: require('../../assets/flexion-lateral-tronco.jpg'),
      description:
        'De pie con las piernas al ancho de hombros, inclínate lateralmente y desliza la mano por la regla hasta donde alcances. Mide en cm desde la cadera (0 cm) hasta la punta de los dedos.',
      // Video demostrativo en español
      videoUrl: 'https://youtu.be/6QbI9mUBiYU?si=EauZ3ecUOblGauu5',
      scoreFunc: (x: number) => {
        const v = Math.min(Math.max(x, 0), 30);
        if (v <= 4) return 0;
        if (v <= 8) {
          // 1–2 pts
          return Math.round(((v - 5) / 3) * 1) + 1;
        }
        if (v <= 14) {
          // 3–4 pts
          return Math.round(((v - 9) / 6) * 1) + 3;
        }
        if (v <= 18) {
          // 5–7 pts
          return Math.round(((v - 15) / 3) * 2) + 5;
        }
        if (v <= 25) {
          // 8–9 pts
          return Math.round(((v - 19) / 6) * 1) + 8;
        }
        return 10; // ≥26 cm
      },
    },
    {
      id: 4,
      name: 'Back Scratch Modificado',
      minCm: 0,
      maxCm: 15,
      image: require('../../assets/back_scratch_modificado.jpg'),
      description:
        'De pie o sentado, una mano sube por encima del hombro y la otra por la espalda baja. Mide en cm la separación entre los dedos. 0 cm = se tocan.',
      // Video demostrativo en español
      videoUrl: 'https://youtu.be/BDpzbMpi6pg?si=EreQcS6s1vYtBhf2',
      scoreFunc: (x: number) => {
        const v = Math.min(Math.max(x, 0), 15);
        // 0 cm ➔ 10 pts, 15 cm ➔ 0 pts
        return Math.round(((15 - v) / 15) * 10);
      },
    },
  ];

  const stretch = stretches[currentIndex];
  const { minCm, maxCm, scoreFunc } = stretch;

  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const openVideo = () => {
    Linking.openURL(stretch.videoUrl);
  };

  const handleNext = () => {
    const parsed = parseFloat(enteredCm);
    if (isNaN(parsed)) {
      Alert.alert('Valor inválido', 'Ingresa un número en cm para continuar.');
      return;
    }
    if (parsed < minCm || parsed > maxCm) {
      Alert.alert(
        'Valor fuera de rango',
        `Para "${stretch.name}", ingresa entre ${minCm} y ${maxCm} cm.`
      );
      return;
    }

    // Calcular puntaje 0–10 con la rúbrica
    const thisScore = scoreFunc(parsed);
    setScores((prev) => [...prev, thisScore]);
    setEnteredCm('');

    if (currentIndex < stretches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Terminar todos los estiramientos y calcular promedio 0–100
      const sumScores = scores.reduce((a, b) => a + b, thisScore);
      const avg0to10 = sumScores / stretches.length;
      const avg0to100 = Math.round(avg0to10 * 10);
      onFinish(avg0to100);
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Prueba de Flexibilidad</Text>

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.exerciseName}>{stretch.name}</Text>
            <TouchableOpacity onPress={openModal} style={styles.infoButton}>
              <Ionicons name="help-circle-outline" size={28} color="#2f855a" />
            </TouchableOpacity>
          </View>

          <Image source={stretch.image} style={styles.image} resizeMode="contain" />

          <Text style={styles.descText}>{stretch.description}</Text>
          <Text style={styles.rangeText}>
            Rango: {minCm} – {maxCm} cm
          </Text>

          <TextInput
            placeholder="Ej. 25.5"
            keyboardType="numeric"
            value={enteredCm}
            onChangeText={setEnteredCm}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex < stretches.length - 1
                ? 'Siguiente Estiramiento'
                : 'Finalizar Flexibilidad'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contador de ejercicio */}
        <Text style={styles.counterText}>
          Ejercicio {currentIndex + 1} de {stretches.length}
        </Text>

        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{stretch.name}</Text>
              <Text style={styles.modalDescription}>{stretch.description}</Text>
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
    </KeyboardAvoidingView>
  );
};

export default FlexibilityTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2f855a',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2f855a',
  },
  infoButton: {
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: 180,
    marginBottom: 15,
    borderRadius: 8,
  },
  descText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    textAlign: 'justify',
  },
  rangeText: {
    fontSize: 14,
    marginBottom: 12,
    color: '#555',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2f855a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2f855a',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
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
  counterText: {
  fontSize: 14,
  color: '#555',
  textAlign: 'center',
  marginTop: 12,
},
});
