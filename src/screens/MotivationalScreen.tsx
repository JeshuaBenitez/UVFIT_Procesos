import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Simulamos los datos de pruebas. En el futuro se puede leer de AsyncStorage o desde API.
const resultadosSimulados = {
  fuerza: 20,
  velocidad: 11.5,
  flexibilidad: 18,
  resistencia: 5,
};

const generarMensaje = (data: typeof resultadosSimulados): string => {
  const { fuerza, velocidad, flexibilidad, resistencia } = data;

  // Fórmula básica para simular un puntaje general
  const score =
    fuerza * 1.5 + flexibilidad * 1.2 + resistencia * 10 - velocidad * 2;

  if (score >= 100) return '¡Increíble desempeño! Eres una máquina 💪🚀';
  if (score >= 70) return 'Muy buen trabajo. Sigue así, vas por excelente camino 🏃‍♂️✨';
  return '¡Buen comienzo! Con disciplina lograrás grandes cambios 🧠🔥';
};

const MotivationalScreen = ({ navigation }: { navigation: any }) => {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Aquí podrías cargar resultados reales desde almacenamiento o contexto
    const mensajeGenerado = generarMensaje(resultadosSimulados);
    setMensaje(mensajeGenerado);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Has completado todas las pruebas! 🎉</Text>
      <Text style={styles.message}>{mensaje}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Performance')}
      >
        <Text style={styles.buttonText}>Ver mi rendimiento</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
    color: '#2E7D32',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 40,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default MotivationalScreen;
