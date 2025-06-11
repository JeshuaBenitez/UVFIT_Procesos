// src/screens/HomeScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  Platform,
  Modal,
  Pressable,
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import UserService from '../services/UserService';
import ApiService from '../services/ApiService'; // ← AGREGADO

const logo = require('../../assets/logo-uvfit.png');

type RootStackParamList = {
  Home: { evaluationsDone?: boolean; userMatricula?: string } | undefined;
  PhysicalEvaluationScreen: undefined;
  Results: {
    fuerza: number;
    velocidad: number;
    flexibilidad: number;
    resistencia: number;
    imc: string;
  };
  Register: undefined;
  Settings: undefined;
  Progress: undefined;
  Routine: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Leemos params de navegación
  const params = (route.params as any) ?? {};
  const loggedUserMatricula =
    typeof params.userMatricula === 'string' ? params.userMatricula : 'ZS24000001';
  const user = UserService.getUserByMatricula(loggedUserMatricula);
  const loggedUserName = user ? user.nombre : 'Invitado';

  // Determina si ya completó evaluación
  const [isNewUser, setIsNewUser] = useState(!params.evaluationsDone);
  const [menuVisible, setMenuVisible] = useState(false);

  // Fecha
  const now = new Date();
  const months = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];
  const weekdays = [
    'Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'
  ];
  const dayOfWeek = weekdays[now.getDay()];
  const dayOfMonth = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const todayIdx = (now.getDay() + 6) % 7; // lunes=0

  // Cuando regresa foco, revisa si trajeron el flag evaluationsDone
  useFocusEffect(
    useCallback(() => {
      const p = (route.params as any) ?? {};
      if (p.evaluationsDone) {
        setIsNewUser(false);
        navigation.setParams({ evaluationsDone: false });
      }

      // Consulta real desde la API
      const verificarEvaluaciones = async () => {
        try {
          const historial = await ApiService.getProgressHistory(loggedUserMatricula);
          const hayEvaluaciones = historial.length > 0;
          setIsNewUser(!hayEvaluaciones);
        } catch (error) {
          console.error('Error al verificar evaluaciones:', error);
          setIsNewUser(true);
        }
      };

      verificarEvaluaciones();
    }, [route.params])
  );

  const handleVerAvances = () => {
    if (isNewUser) {
      Alert.alert('No hay datos','Aún no completas ninguna evaluación.');
    } else {
      navigation.navigate('Progress');
    }
  };

  const handleComenzarRutina = () => {
    if (isNewUser) {
      Alert.alert('No hay datos','Debes terminar las evaluaciones primero.');
    } else {
      navigation.navigate('Routine');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <ImageBackground
        source={require('../../assets/waves.jpg')}
        style={styles.fullBackground}
        imageStyle={{ opacity: 0.6, transform: [{ scale: 1.2 }] }}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetingText}>Hola, {loggedUserName}</Text>
            <Text style={styles.dateText}>
              {dayOfWeek}, {dayOfMonth} de{'\n'}{month} del {year}
            </Text>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity><Ionicons name="notifications-outline" size={24} color="white" /></TouchableOpacity>
            <TouchableOpacity><Ionicons name="help-circle-outline" size={24} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menú */}
        <Modal
          transparent
          visible={menuVisible}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
            <View style={[styles.menuBox, isDark ? styles.menuDark : styles.menuLight]}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate('Settings');
                }}
              >
                <Text style={styles.menuText}>Configuración</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        {/* Bienvenida */}
        <View style={styles.welcome}>
          <Text style={styles.title}>¡Bienvenido a UVFit!</Text>
          <Text style={styles.subtitle}>"¡Nunca te rindas, cada día cuenta!"</Text>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>

        {/* Calendario */}
        <View style={styles.calendar}>
          {WEEK_DAYS.map((d, i) => (
            <View key={i} style={[styles.dayCircle, i === todayIdx && styles.todayCircle]}>
              <Text style={i === todayIdx ? styles.todayText : styles.dayText}>{d}</Text>
            </View>
          ))}
        </View>

        {/* Botones */}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => navigation.navigate('PhysicalEvaluationScreen')}>
            <LinearGradient
              colors={['#48bb78','#2f855a']}
              start={{x:0,y:0}} end={{x:1,y:0}}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Evaluaciones Físicas</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleVerAvances}>
            <LinearGradient
              colors={['#48bb78','#2f855a']}
              start={{x:0,y:0}} end={{x:1,y:0}}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Ver Avances</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleComenzarRutina}>
            <LinearGradient
              colors={['#48bb78','#2f855a']}
              start={{x:0,y:0}} end={{x:1,y:0}}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Comenzar Rutina</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightBg: { backgroundColor: '#fff' },
  darkBg: { backgroundColor: '#121212' },
  fullBackground: { flex: 1, width: '100%', height: '100%' },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2f855a',
    padding: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
  },
  greetingText: { color: 'white', fontSize: 18, fontWeight: '700' },
  dateText: { color: 'white', fontSize: 14, marginTop: 4 },
  icons: { flexDirection: 'row', width: 88, justifyContent: 'space-between' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  menuBox: {
    position: 'absolute', top: Platform.OS==='ios'?80:70, right:15,
    width: 150, borderRadius: 6, padding: 8, elevation: 8
  },
  menuLight: { backgroundColor: 'white' },
  menuDark: { backgroundColor: '#333' },
  menuItem: { padding: 12 },
  menuText: { fontSize: 16 },

  welcome: { alignItems: 'center', marginTop: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#2f855a' },
  subtitle: { fontSize: 16, fontStyle: 'italic', marginTop: 6, color: '#2f855a' },

  logoContainer: { alignItems: 'center', marginVertical: 20 },
  logo: { width: 120, height: 60, resizeMode: 'contain' },

  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  dayCircle: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#e2e8f0'
  },
  todayCircle: {
    backgroundColor: '#18529D',
    borderWidth: 4, borderColor: '#38a169'
  },
  dayText: { fontSize: 16, color: '#2f855a' },
  todayText: { fontSize: 16, color: 'white', fontWeight: '700' },

  buttons: { paddingHorizontal: 20, marginTop: 10 },
  button: {
    backgroundColor: '#38a169',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700' },
});
