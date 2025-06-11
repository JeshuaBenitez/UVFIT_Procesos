// src/screens/DailyRoutineScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import RoutineService, { RoutineExercise } from '../services/RoutineService';

type Props = NativeStackScreenProps<RootStackParamList, 'Routine'>;

const DailyRoutineScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(true);
  const [routine, setRoutine] = useState<RoutineExercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const data = await RoutineService.getDailyRoutine();
        setRoutine(data);
      } catch (err) {
        console.warn('Error al traer rutina diaria:', err);
        setError('No se pudo cargar la rutina. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoutine();
  }, []);

  const renderItem = ({ item }: { item: RoutineExercise }) => (
    <View style={styles.card}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Image source={item.image} style={styles.exerciseImage} resizeMode="cover" />
      <Text style={styles.descText}>{item.description}</Text>
      <Text style={styles.metaText}>
        Series: {item.sets} – {item.reps > 0 ? `${item.reps} reps` : `${item.restSeconds}s`}
      </Text>
      <Text style={styles.metaText}>Descanso: {item.restSeconds}s</Text>

      {item.videoUrl && (
      <TouchableOpacity
        style={styles.videoButton}
        onPress={() => {
          // Capturamos en una variable local para que TS entienda que ya no es undefined
          const url = item.videoUrl;
          if (!url) return;
          Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'No se pudo abrir el video.')
          );
        }}
      >
    <Text style={styles.videoButtonText}>Ver Video</Text>
  </TouchableOpacity>
)}

    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2f855a" />
        <Text style={styles.loadingText}>Cargando rutina diaria…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            RoutineService.getDailyRoutine()
              .then(data => {
                setRoutine(data);
                setLoading(false);
              })
              .catch(() => {
                setError('No se pudo cargar la rutina. Intenta más tarde.');
                setLoading(false);
              });
          }}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rutina Diaria</Text>
      <FlatList
        data={routine}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => {
          Alert.alert('¡Felicidades!', 'Has completado la rutina diaria.', [
            {
              text: 'Aceptar',
              onPress: () => navigation.navigate('Home'),
            },
          ]);
        }}
      >
        <Text style={styles.completeButtonText}>Marcar como Completada</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DailyRoutineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#2f855a',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2f855a',
    marginBottom: 8,
  },
  exerciseImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  videoButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  videoButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  completeButton: {
    backgroundColor: '#2f855a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#2f855a',
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
});
