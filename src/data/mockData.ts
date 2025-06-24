import { User, Client, ProgressEntry, Exercise, Workout, DietPlan, Message, Appointment, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'trainer@fitpro.com',
    name: 'Carlos Mendoza',
    role: 'trainer',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'ana@cliente.com',
    name: 'Ana García',
    role: 'client',
    trainerId: '1',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    email: 'miguel@cliente.com',
    name: 'Miguel Rodríguez',
    role: 'client',
    trainerId: '1',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    createdAt: new Date('2024-02-01')
  }
];

export const mockClients: Client[] = [
  {
    id: '2',
    name: 'Ana García',
    email: 'ana@cliente.com',
    age: 28,
    gender: 'female',
    height: 165,
    currentWeight: 62,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    trainerId: '1',
    createdAt: new Date('2024-01-15'),
    goals: ['Perder peso', 'Tonificar músculos', 'Mejorar resistencia'],
    notes: 'Principiante en ejercicio. Le gusta el cardio. Disponible martes y jueves por la tarde.'
  },
  {
    id: '3',
    name: 'Miguel Rodríguez',
    email: 'miguel@cliente.com',
    age: 35,
    gender: 'male',
    height: 178,
    currentWeight: 85,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    trainerId: '1',
    createdAt: new Date('2024-02-01'),
    goals: ['Ganar masa muscular', 'Mejorar fuerza', 'Reducir grasa corporal'],
    notes: 'Experiencia previa en gimnasio. Enfoque en entrenamiento de fuerza. Prefiere entrenamientos matutinos.'
  }
];

export const mockProgressEntries: ProgressEntry[] = [
  {
    id: '1',
    clientId: '2',
    date: new Date('2024-01-15'),
    weight: 65,
    bodyFat: 28,
    muscleMass: 45,
    bmi: 23.9,
    measurements: { chest: 88, waist: 75, hips: 95, arms: 28, thighs: 58 }
  },
  {
    id: '2',
    clientId: '2',
    date: new Date('2024-02-15'),
    weight: 63,
    bodyFat: 26,
    muscleMass: 46,
    bmi: 23.1,
    measurements: { chest: 87, waist: 73, hips: 93, arms: 28, thighs: 57 }
  },
  {
    id: '3',
    clientId: '2',
    date: new Date('2024-03-15'),
    weight: 62,
    bodyFat: 24,
    muscleMass: 47,
    bmi: 22.8,
    measurements: { chest: 86, waist: 71, hips: 92, arms: 29, thighs: 56 }
  },
  {
    id: '4',
    clientId: '3',
    date: new Date('2024-02-01'),
    weight: 88,
    bodyFat: 18,
    muscleMass: 65,
    bmi: 27.8,
    measurements: { chest: 105, waist: 88, hips: 98, arms: 38, thighs: 65 }
  },
  {
    id: '5',
    clientId: '3',
    date: new Date('2024-03-01'),
    weight: 86,
    bodyFat: 16,
    muscleMass: 67,
    bmi: 27.2,
    measurements: { chest: 107, waist: 85, hips: 96, arms: 39, thighs: 66 }
  },
  {
    id: '6',
    clientId: '3',
    date: new Date('2024-04-01'),
    weight: 85,
    bodyFat: 15,
    muscleMass: 68,
    bmi: 26.8,
    measurements: { chest: 108, waist: 83, hips: 95, arms: 40, thighs: 67 }
  }
];

export const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Sentadillas',
    category: 'Piernas',
    description: 'Ejercicio fundamental para piernas y glúteos',
    instructions: ['Mantén los pies separados al ancho de hombros', 'Desciende como si fueras a sentarte', 'Mantén la espalda recta'],
    targetMuscles: ['Cuádriceps', 'Glúteos', 'Isquiotibiales']
  },
  {
    id: '2',
    name: 'Press de Banca',
    category: 'Pecho',
    description: 'Ejercicio básico para el desarrollo del pecho',
    instructions: ['Acuéstate en el banco', 'Agarra la barra con agarre medio', 'Baja controladamente al pecho'],
    targetMuscles: ['Pectorales', 'Tríceps', 'Deltoides']
  },
  {
    id: '3',
    name: 'Dominadas',
    category: 'Espalda',
    description: 'Ejercicio para el desarrollo de la espalda y brazos',
    instructions: ['Cuelga de la barra', 'Tira hacia arriba hasta que el mentón pase la barra', 'Baja controladamente'],
    targetMuscles: ['Dorsales', 'Bíceps', 'Romboides']
  }
];

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    clientId: '2',
    name: 'Rutina de Fuerza - Día 1',
    date: new Date('2024-03-20'),
    exercises: [
      { exerciseId: '1', sets: 3, reps: '12-15', weight: 45, rest: 60 },
      { exerciseId: '2', sets: 3, reps: '8-10', weight: 30, rest: 90 }
    ],
    completed: true,
    duration: 45,
    feeling: 4,
    energy: 3
  },
  {
    id: '2',
    clientId: '3',
    name: 'Rutina de Hipertrofia - Pecho',
    date: new Date('2024-03-21'),
    exercises: [
      { exerciseId: '2', sets: 4, reps: '8-12', weight: 80, rest: 120 },
      { exerciseId: '3', sets: 3, reps: '6-8', rest: 90 }
    ],
    completed: true,
    duration: 60,
    feeling: 5,
    energy: 4
  }
];

// Estado reactivo de mensajes que se actualiza en tiempo real
export let mockMessages: Message[] = [
  {
    id: '1',
    fromId: '1',
    toId: '2',
    content: '¡Hola Ana! ¿Cómo te fue con la rutina de ayer?',
    timestamp: new Date('2024-03-21T10:30:00'),
    read: true
  },
  {
    id: '2',
    fromId: '2',
    toId: '1',
    content: 'Muy bien Carlos! Me costó un poco las sentadillas pero logré completar todo.',
    timestamp: new Date('2024-03-21T11:15:00'),
    read: true
  },
  {
    id: '3',
    fromId: '1',
    toId: '2',
    content: 'Perfecto, es normal al principio. Para la próxima sesión vamos a trabajar en tu técnica.',
    timestamp: new Date('2024-03-21T11:20:00'),
    read: false
  },
  {
    id: '4',
    fromId: '3',
    toId: '1',
    content: 'Hola Carlos, tengo una duda sobre la rutina de hoy.',
    timestamp: new Date('2024-03-21T14:30:00'),
    read: false
  },
  {
    id: '5',
    fromId: '1',
    toId: '3',
    content: 'Claro Miguel, dime qué necesitas.',
    timestamp: new Date('2024-03-21T14:35:00'),
    read: true
  },
  {
    id: '6',
    fromId: '3',
    toId: '1',
    content: '¿Puedo aumentar el peso en el press de banca?',
    timestamp: new Date('2024-03-21T14:40:00'),
    read: false
  },
  {
    id: '7',
    fromId: '2',
    toId: '1',
    content: '¿A qué hora es nuestra sesión de mañana?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutos atrás
    read: false
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '2',
    trainerId: '1',
    date: new Date('2024-03-25'),
    startTime: '16:00',
    endTime: '17:00',
    location: 'Gimnasio FitPro - Sala 1',
    type: 'personal',
    status: 'scheduled',
    notes: 'Enfoque en técnica de sentadillas'
  },
  {
    id: '2',
    clientId: '3',
    trainerId: '1',
    date: new Date('2024-03-26'),
    startTime: '08:00',
    endTime: '09:00',
    location: 'Gimnasio FitPro - Sala 2',
    type: 'personal',
    status: 'scheduled',
    notes: 'Rutina de espalda y bíceps'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'message',
    title: 'Nuevo mensaje',
    message: 'Ana García te ha enviado un mensaje',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
    read: false,
    actionUrl: '/messages',
    priority: 'medium',
    relatedId: '2'
  },
  {
    id: '2',
    userId: '1',
    type: 'workout',
    title: 'Entrenamiento completado',
    message: 'Miguel Rodríguez completó su rutina de pecho',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: false,
    actionUrl: '/clients/3',
    priority: 'low',
    relatedId: '3'
  },
  {
    id: '3',
    userId: '1',
    type: 'appointment',
    title: 'Cita próxima',
    message: 'Tienes una cita con Ana García en 1 hora',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
    read: false,
    actionUrl: '/calendar',
    priority: 'high',
    relatedId: '1'
  },
  {
    id: '4',
    userId: '2',
    type: 'workout',
    title: 'Nueva rutina asignada',
    message: 'Carlos Mendoza te ha asignado una nueva rutina',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    read: true,
    actionUrl: '/workouts',
    priority: 'medium',
    relatedId: '1'
  },
  {
    id: '5',
    userId: '2',
    type: 'appointment',
    title: 'Recordatorio de cita',
    message: 'Tu sesión de entrenamiento es mañana a las 16:00',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    read: false,
    actionUrl: '/calendar',
    priority: 'medium',
    relatedId: '1'
  },
  {
    id: '6',
    userId: '1',
    type: 'progress',
    title: 'Nuevo progreso registrado',
    message: 'Ana García ha registrado nuevas mediciones',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
    read: true,
    actionUrl: '/clients/2',
    priority: 'low',
    relatedId: '2'
  }
];

// Función para actualizar el estado de los mensajes
export const updateMessageReadStatus = (messageId: string, read: boolean) => {
  const messageIndex = mockMessages.findIndex(msg => msg.id === messageId);
  if (messageIndex !== -1) {
    mockMessages[messageIndex] = { ...mockMessages[messageIndex], read };
  }
};

// Función para agregar nuevos mensajes
export const addNewMessage = (message: Omit<Message, 'id'>) => {
  const newMessage: Message = {
    ...message,
    id: Date.now().toString()
  };
  mockMessages.push(newMessage);
  return newMessage;
};