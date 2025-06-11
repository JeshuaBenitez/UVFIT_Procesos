// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Linking, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import UserService, { User } from '../services/UserService';

const STORAGE_KEY_MATRICULA = 'userMatricula';
const STAR_KEY = 'userStars';

const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stars, setStars] = useState(0);

  useEffect(() => {
    // 1) carga matrícula y usuario
    AsyncStorage.getItem(STORAGE_KEY_MATRICULA).then(m => {
      if (m) {
        const u = UserService.getUserByMatricula(m);
        if (u) setUser(u);
      }
    });
    // 2) carga estrellas
    AsyncStorage.getItem(STAR_KEY).then(v => {
      const n = v ? parseInt(v, 10) : 0;
      setStars(isNaN(n) ? 0 : n);
    });
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['authToken', STORAGE_KEY_MATRICULA]);
    Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
    navigation.replace('Login');
  };

  const goToProfile = () => {
    if (!user) {
      Alert.alert('Error', 'No se encontró tu usuario, vuelve a iniciar sesión.');
    } else {
      navigation.navigate('Profile', { user });
    }
  };

  return (
    <View style={styles.container}>
      {/* contador de estrellas */}
      <View style={styles.starsContainer}>
        <Ionicons name="star" size={24} color="#FFD700" />
        <Text style={styles.starsText}>{stars} Estrella{stars === 1 ? '' : 's'}</Text>
      </View>

      <Text style={styles.title}>Configuración</Text>

      <TouchableOpacity style={styles.optionButton} onPress={goToProfile}>
        <Text style={styles.optionText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Modo Oscuro: Próximamente 🌙</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => Linking.openURL('https://tusitio.com/terminos')}
      >
        <Text style={styles.optionText}>Términos de uso</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex:1, padding:24, backgroundColor:'#fff' },
  starsContainer: { flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:20 },
  starsText: { marginLeft:8, fontSize:18, fontWeight:'600' },
  title: { fontSize:22, fontWeight:'bold', textAlign:'center', marginBottom:30 },
  optionButton: { padding:14, backgroundColor:'#e0e0e0', borderRadius:8, marginBottom:12 },
  optionText: { fontSize:16 },
  logoutButton: { marginTop:30, padding:14, backgroundColor:'#d32f2f', borderRadius:8, alignItems:'center' },
  logoutText: { color:'#fff', fontWeight:'bold', fontSize:16 },
});
