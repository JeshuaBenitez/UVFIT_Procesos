// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import UserService, { User } from '../services/UserService';
import { RootStackParamList } from '../navigation/AppNavigation';

const LAST_UPDATE_KEY = 'profileLastUpdate';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({ route }: Props) => {
  const { user } = route.params;
  const [data, setData] = useState<User>(user);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);

  // 1️⃣ Al montar, cargamos del UserService en memoria
  useEffect(() => {
    const stored = UserService.getUserByMatricula(user.matricula);
    if (stored) {
      setData(stored);
    }
    setLoading(false);
  }, [user.matricula]);

  // 2️⃣ Permitimos editar cada 3 meses
  useEffect(() => {
    AsyncStorage.getItem(LAST_UPDATE_KEY)
      .then(ts => {
        if (!ts || Date.now() - parseInt(ts, 10) > 90 * 24 * 3600 * 1000) {
          setEditable(true);
        }
      })
      .catch(() => {
        setEditable(true);
      });
  }, [loading]);

  const handleSave = async () => {
    // Actualiza en el array interno
    const ok = UserService.updateUser(data);
    if (ok) {
      await AsyncStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
      Alert.alert('Perfil actualizado', 'Tus datos se guardaron correctamente.');
      setEditable(false);
    } else {
      Alert.alert('Error', 'No se pudo actualizar tu perfil.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2f855a" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>

      <TextInput
        style={[styles.input, !editable && styles.disabled]}
        value={data.nombre}
        onChangeText={t => setData({ ...data, nombre: t })}
        placeholder="Nombre"
        editable={editable}
      />

      <TextInput
        style={[styles.input, !editable && styles.disabled]}
        value={data.apellidoPaterno}
        onChangeText={t => setData({ ...data, apellidoPaterno: t })}
        placeholder="Apellido Paterno"
        editable={editable}
      />

      <TextInput
        style={[styles.input, !editable && styles.disabled]}
        value={data.apellidoMaterno}
        onChangeText={t => setData({ ...data, apellidoMaterno: t })}
        placeholder="Apellido Materno"
        editable={editable}
      />

      <TextInput
        style={[styles.input, !editable && styles.disabled]}
        value={data.correo}
        onChangeText={t => setData({ ...data, correo: t })}
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        editable={editable}
      />

      <Text style={styles.readOnlyLabel}>Matrícula</Text>
      <Text style={styles.readOnly}>{data.matricula}</Text>

      {editable ? (
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Guardar cambios</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.note}>Sólo puedes editar tu perfil cada 3 meses.</Text>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  disabled: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  readOnlyLabel: {
    fontWeight: '600',
    marginTop: 8,
  },
  readOnly: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: '#2f855a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  note: {
    textAlign: 'center',
    marginTop: 12,
    color: '#666',
  },
});
