import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Datos simulados de pruebas
const resultadosSimulados = {
  fuerza: 20,
  velocidad: 11.5,
  flexibilidad: 18,
  resistencia: 5,
};

const PerformanceSummaryScreen = ({ navigation }: { navigation: any }) => {
  const { fuerza, velocidad, flexibilidad, resistencia } = resultadosSimulados;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de Rendimiento 🧠📊</Text>

      <View style={styles.card}>
        <Text style={styles.item}>💪 Fuerza: {fuerza} repeticiones</Text>
        <Text style={styles.item}>⚡ Velocidad: {velocidad}s en 50m</Text>
        <Text style={styles.item}>🧘 Flexibilidad: {flexibilidad} cm</Text>
        <Text style={styles.item}>🏃 Resistencia: {resistencia} min</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
        <Text style={styles.buttonText}>Ir al Menú Principal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f1f8f2',
    marginBottom: 30,
  },
  item: { fontSize: 18, marginBottom: 10, color: '#2E7D32' },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 40,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default PerformanceSummaryScreen;
