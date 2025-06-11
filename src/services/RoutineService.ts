// src/services/RoutineService.ts

export interface RoutineExercise {
  id: string;
  name: string;
  description: string;
  image: any;        // recurso local
  videoUrl?: string; // URL externa
  sets: number;
  reps: number;
  restSeconds: number;
}

export default class RoutineService {
  static async getDailyRoutine(): Promise<RoutineExercise[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'e1',
            name: 'Flexiones de Pecho',
            description:
              'Realiza 3 series de 12 repeticiones de flexiones manteniendo la espalda recta.',
            image: require('../../assets/flexiones.jpg'),
            videoUrl: 'https://youtu.be/iAEM8Mx-4nM?si=G7WA40jOvJSvavef',
            sets: 3,
            reps: 12,
            restSeconds: 60,
          },
          {
            id: 'e2',
            name: 'Sentadillas',
            description:
              '3 series de 15 repeticiones con pausa de 60seg entre series.',
            image: require('../../assets/sentadilla.jpg'),
            videoUrl: 'https://youtu.be/BjixzWEw4EY?si=InGmMyuuVdcmxUqQ',
            sets: 3,
            reps: 15,
            restSeconds: 60,
          },
          {
            id: 'e3',
            name: 'Plancha',
            description:
              'Mantén posición de plancha frontal durante 3 series de 45 segundos cada una.',
            image: require('../../assets/plancha.jpg'),
            videoUrl: 'https://youtu.be/X4k-fC-ubrI?si=N66cUm2TZ3R8OObj',
            sets: 3,
            reps: 0,
            restSeconds: 45,
          },
          {
            id: 'e4',
            name: 'Dominadas',
            description:
              '2 series al fallo, intentando llegar al máximo número de repeticiones.',
            image: require('../../assets/dominadas.jpg'),
            videoUrl: 'https://youtu.be/OLqm4HTdr34?si=cW9f9T5CDVxCbMAY',
            sets: 2,
            reps: 8,
            restSeconds: 90,
          },
        ]);
      }, 1200);
    });
  }
}
