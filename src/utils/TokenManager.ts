import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('jwtToken', token);
  } catch (err) {
    console.error('Error al guardar token:', err);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('jwtToken');
  } catch (err) {
    console.error('Error al obtener token:', err);
    return null;
  }
};

// 🔥 SIN jwt-decode, usando base64
export const getTokenPayload = async (): Promise<any | null> => {
  try {
    const token = await getToken();
    if (!token) throw new Error('No hay token');

    const [, payloadBase64] = token.split('.');
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  } catch (err) {
    console.error('Error al decodificar token:', err);
    return null;
  }
};
