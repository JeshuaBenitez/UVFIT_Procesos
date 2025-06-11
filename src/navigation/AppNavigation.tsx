// src/navigation/AppNavigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- importa tu tipo User ---
import type { User } from '../services/UserService';

// Importa pantallas (usa rutas relativas si no tienes alias “@” configurado)
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RecoverCredentialsScreen from '../screens/RecoverCredentialsScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PhysicalEvaluationScreen from '../screens/PhysicalEvaluationScreen';
import PruebasMenuScreen from '../screens/PruebasMenuScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ResultsScreen from '../screens/ResultsScreen';
import StrengthTestScreen from '../screens/StrengthTestScreen';
import SpeedTestScreen from '../screens/SpeedTestScreen';
import FlexibilityTestScreen from '../screens/FlexibilityTestScreen';
import ResistanceTestScreen from '../screens/ResistanceTestScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DailyRoutineScreen from '../screens/DailyRoutineScreen';
import MotivationalScreen from '../screens/MotivationalScreen';
import PerformanceSummaryScreen from '../screens/PerformanceSummaryScreen';

// ✅ src/navigation/AppNavigation.tsx actualizado
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  RecoverCredentials: undefined;

  Home: { evaluationsDone?: boolean; userMatricula?: string } | undefined;
  Profile: { user: User };

  PhysicalEvaluationScreen: undefined;
  PruebasMenuScreen: { imc: string; idEvaluacionFisica: number };

  Strength: { onFinish: (score: number) => void };
  Speed: { onFinish: (score: number) => void };
  Flexibility: { onFinish: (score: number) => void };
  Resistance: { onFinish: (score: number) => void };

  Progress: undefined;
  Results: {
  fuerza: number;
  velocidad: number;
  flexibilidad: number;
  resistencia: number;
  imc: string;
  idEvaluacionFisica: number;
};


  Settings: undefined;
  Routine: undefined;
  Motivational: undefined;
  Performance: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RecoverCredentials" component={RecoverCredentialsScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />

        <Stack.Screen name="PhysicalEvaluationScreen" component={PhysicalEvaluationScreen} />
        <Stack.Screen name="PruebasMenuScreen" component={PruebasMenuScreen} />

        <Stack.Screen name="Strength" component={StrengthTestScreen} />
        <Stack.Screen name="Speed" component={SpeedTestScreen} />
        <Stack.Screen name="Flexibility" component={FlexibilityTestScreen} />
        <Stack.Screen name="Resistance" component={ResistanceTestScreen} />

        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />

        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Routine" component={DailyRoutineScreen} />
        <Stack.Screen name="Motivational" component={MotivationalScreen} />
        <Stack.Screen name="Performance" component={PerformanceSummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
