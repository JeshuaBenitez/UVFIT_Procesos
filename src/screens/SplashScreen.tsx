import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useColorScheme,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
};

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashNavigationProp>();
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animación combinada: fadeIn + scale up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  const isDark = colorScheme === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={isDark ? ['#0f2027', '#203a43', '#2c5364'] : ['#a1c4fd', '#c2e9fb']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.Image
          source={require('../../assets/logo-uvfit.png')}
          style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
          resizeMode="contain"
        />
          <Animated.Text
            style={[
              styles.versionText,
              {
                opacity: fadeAnim,
              },
              isDark ? styles.versionTextDark : styles.versionTextLight,
            ]}
          >
            Versión 1.0.0
          </Animated.Text>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionTextLight: {
    color: '#555',
  },
  versionTextDark: {
    color: '#ddd',
  },
});
