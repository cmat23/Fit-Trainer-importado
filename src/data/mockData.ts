import { User, Client, ProgressEntry, Exercise, Workout, DietPlan, Message, Appointment, Notification, FitnessData, DeviceConnection, DailyActivity, Mission, ClientPoints, Achievement, PointsTransaction, Reward, RewardClaim, Leaderboard } from '../types';

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

// Nuevos datos mock para planes de dieta
export const mockDietPlans: DietPlan[] = [
  {
    id: '1',
    clientId: '2',
    trainerId: '1',
    name: 'Plan de Definición - Ana García',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-31'),
    targetCalories: 1800,
    targetProtein: 120,
    targetCarbs: 180,
    targetFat: 60,
    meals: {
      breakfast: [
        {
          id: '1',
          name: 'Avena con frutas',
          calories: 350,
          protein: 12,
          carbs: 55,
          fat: 8,
          time: '08:00',
          description: '60g avena + 1 plátano + 15g almendras + canela'
        },
        {
          id: '2',
          name: 'Café con leche desnatada',
          calories: 80,
          protein: 6,
          carbs: 8,
          fat: 1,
          time: '08:30',
          description: '200ml leche desnatada + café'
        }
      ],
      lunch: [
        {
          id: '3',
          name: 'Pechuga de pollo a la plancha',
          calories: 250,
          protein: 45,
          carbs: 0,
          fat: 6,
          time: '13:30',
          description: '150g pechuga de pollo con especias'
        },
        {
          id: '4',
          name: 'Arroz integral con verduras',
          calories: 200,
          protein: 5,
          carbs: 40,
          fat: 2,
          time: '13:30',
          description: '80g arroz integral + brócoli + zanahoria'
        },
        {
          id: '5',
          name: 'Ensalada mixta',
          calories: 120,
          protein: 3,
          carbs: 8,
          fat: 8,
          time: '13:30',
          description: 'Lechuga, tomate, pepino + 1 cdta aceite oliva'
        }
      ],
      dinner: [
        {
          id: '6',
          name: 'Salmón al horno',
          calories: 280,
          protein: 35,
          carbs: 0,
          fat: 15,
          time: '20:00',
          description: '120g salmón con limón y hierbas'
        },
        {
          id: '7',
          name: 'Verduras al vapor',
          calories: 80,
          protein: 3,
          carbs: 15,
          fat: 1,
          time: '20:00',
          description: 'Brócoli, calabacín y judías verdes'
        }
      ],
      snacks: [
        {
          id: '8',
          name: 'Yogur griego con nueces',
          calories: 180,
          protein: 15,
          carbs: 12,
          fat: 8,
          time: '16:00',
          description: '150g yogur griego 0% + 15g nueces'
        },
        {
          id: '9',
          name: 'Manzana',
          calories: 80,
          protein: 0,
          carbs: 20,
          fat: 0,
          time: '11:00',
          description: '1 manzana mediana'
        }
      ]
    },
    notes: 'Plan diseñado para pérdida de grasa manteniendo masa muscular. Beber 2-3L de agua al día. Tomar las comidas a las horas indicadas. Permitido 1 día libre a la semana.',
    createdAt: new Date('2024-02-28')
  },
  {
    id: '2',
    clientId: '3',
    trainerId: '1',
    name: 'Plan de Volumen - Miguel Rodríguez',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-06-15'),
    targetCalories: 2800,
    targetProtein: 180,
    targetCarbs: 350,
    targetFat: 90,
    meals: {
      breakfast: [
        {
          id: '10',
          name: 'Tortilla de 3 huevos',
          calories: 300,
          protein: 24,
          carbs: 2,
          fat: 20,
          time: '07:30',
          description: '3 huevos enteros + 1 cdta aceite oliva'
        },
        {
          id: '11',
          name: 'Tostadas integrales con aguacate',
          calories: 280,
          protein: 8,
          carbs: 35,
          fat: 12,
          time: '07:30',
          description: '2 rebanadas pan integral + 1/2 aguacate'
        },
        {
          id: '12',
          name: 'Batido de proteína',
          calories: 200,
          protein: 25,
          carbs: 15,
          fat: 3,
          time: '08:00',
          description: '1 scoop proteína whey + 250ml leche'
        }
      ],
      lunch: [
        {
          id: '13',
          name: 'Ternera magra',
          calories: 350,
          protein: 50,
          carbs: 0,
          fat: 15,
          time: '14:00',
          description: '180g ternera magra a la plancha'
        },
        {
          id: '14',
          name: 'Pasta integral',
          calories: 300,
          protein: 12,
          carbs: 60,
          fat: 2,
          time: '14:00',
          description: '100g pasta integral con tomate natural'
        },
        {
          id: '15',
          name: 'Ensalada con aceite',
          calories: 150,
          protein: 2,
          carbs: 8,
          fat: 12,
          time: '14:00',
          description: 'Ensalada variada + 1 cda aceite oliva'
        }
      ],
      dinner: [
        {
          id: '16',
          name: 'Pechuga de pavo',
          calories: 220,
          protein: 40,
          carbs: 0,
          fat: 6,
          time: '21:00',
          description: '150g pechuga de pavo al horno'
        },
        {
          id: '17',
          name: 'Patata dulce asada',
          calories: 180,
          protein: 3,
          carbs: 40,
          fat: 1,
          time: '21:00',
          description: '200g patata dulce asada con especias'
        }
      ],
      snacks: [
        {
          id: '18',
          name: 'Frutos secos mixtos',
          calories: 200,
          protein: 6,
          carbs: 8,
          fat: 16,
          time: '11:00',
          description: '30g almendras, nueces y avellanas'
        },
        {
          id: '19',
          name: 'Plátano con mantequilla de cacahuete',
          calories: 250,
          protein: 8,
          carbs: 30,
          fat: 12,
          time: '17:00',
          description: '1 plátano + 1 cda mantequilla cacahuete'
        },
        {
          id: '20',
          name: 'Caseína antes de dormir',
          calories: 150,
          protein: 25,
          carbs: 5,
          fat: 2,
          time: '23:00',
          description: '1 scoop proteína caseína + agua'
        }
      ]
    },
    notes: 'Plan para ganancia de masa muscular. Importante mantener superávit calórico. Tomar suplementos según indicaciones. Hidratación constante durante el día.',
    createdAt: new Date('2024-02-10')
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

// Nuevos datos mock para fitness y dispositivos
export const mockFitnessData: FitnessData[] = [
  {
    id: '1',
    clientId: '2',
    date: new Date(),
    source: 'apple_health',
    dataType: 'steps',
    value: 8547,
    unit: 'steps',
    syncedAt: new Date()
  },
  {
    id: '2',
    clientId: '2',
    date: new Date(),
    source: 'apple_health',
    dataType: 'calories',
    value: 2340,
    unit: 'kcal',
    syncedAt: new Date()
  },
  {
    id: '3',
    clientId: '2',
    date: new Date(),
    source: 'apple_health',
    dataType: 'heart_rate',
    value: 72,
    unit: 'bpm',
    metadata: {
      averageHeartRate: 72,
      maxHeartRate: 145
    },
    syncedAt: new Date()
  }
];

export const mockDeviceConnections: DeviceConnection[] = [
  {
    id: '1',
    clientId: '2',
    deviceType: 'apple_watch',
    deviceName: 'Apple Watch Series 8',
    isConnected: true,
    lastSync: new Date(Date.now() - 30 * 60 * 1000),
    permissions: ['steps', 'heart_rate', 'workouts', 'sleep'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    clientId: '3',
    deviceType: 'fitbit',
    deviceName: 'Fitbit Versa 4',
    isConnected: true,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
    permissions: ['steps', 'calories', 'heart_rate', 'sleep'],
    createdAt: new Date('2024-02-01')
  }
];

export const mockDailyActivity: DailyActivity[] = [
  {
    id: '1',
    clientId: '2',
    date: new Date(),
    steps: 8547,
    caloriesBurned: 2340,
    activeMinutes: 67,
    distance: 6.2,
    averageHeartRate: 72,
    sleepHours: 7.5,
    workouts: [
      {
        type: 'Correr',
        duration: 35,
        calories: 320,
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        type: 'Entrenamiento de fuerza',
        duration: 45,
        calories: 180,
        startTime: new Date(Date.now() - 8 * 60 * 60 * 1000)
      }
    ],
    source: 'Apple Health',
    syncedAt: new Date()
  }
];

// Nuevos datos mock para el sistema de incentivos
export const mockMissions: Mission[] = [
  {
    id: '1',
    trainerId: '1',
    clientId: '2',
    title: 'Camina 10,000 pasos diarios',
    description: 'Mantén una actividad constante caminando al menos 10,000 pasos cada día durante una semana',
    type: 'steps',
    difficulty: 'easy',
    points: 50,
    target: {
      value: 10000,
      unit: 'pasos',
      timeframe: 'daily'
    },
    status: 'active',
    progress: 75,
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    category: 'fitness',
    icon: '🚶‍♀️',
    color: 'blue',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    trainerId: '1',
    clientId: '2',
    title: 'Completa 5 entrenamientos',
    description: 'Completa 5 sesiones de entrenamiento en las próximas 2 semanas',
    type: 'workout',
    difficulty: 'medium',
    points: 100,
    target: {
      value: 5,
      unit: 'entrenamientos',
      timeframe: 'total'
    },
    status: 'active',
    progress: 60,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    category: 'fitness',
    icon: '💪',
    color: 'green',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    trainerId: '1',
    clientId: '2',
    title: 'Racha de 7 días',
    description: 'Mantén una racha de actividad durante 7 días consecutivos',
    type: 'consistency',
    difficulty: 'hard',
    points: 150,
    target: {
      value: 7,
      unit: 'días',
      timeframe: 'total'
    },
    status: 'completed',
    progress: 100,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: 'challenge',
    icon: '🔥',
    color: 'orange',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    trainerId: '1',
    clientId: '3',
    title: 'Quema 500 calorías',
    description: 'Quema al menos 500 calorías en una sola sesión de entrenamiento',
    type: 'calories',
    difficulty: 'medium',
    points: 75,
    target: {
      value: 500,
      unit: 'calorías',
      timeframe: 'daily'
    },
    status: 'active',
    progress: 80,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    category: 'fitness',
    icon: '🔥',
    color: 'red',
    createdAt: new Date()
  }
];

export const mockClientPoints: ClientPoints[] = [
  {
    id: '1',
    clientId: '2',
    totalPoints: 1250,
    currentLevel: 8,
    pointsToNextLevel: 150,
    weeklyPoints: 275,
    monthlyPoints: 850,
    streak: {
      current: 12,
      longest: 18,
      lastActivity: new Date()
    },
    achievements: [
      {
        id: 'first_mission',
        name: 'Primera Misión',
        description: 'Completa tu primera misión',
        icon: '🎯',
        color: 'blue',
        points: 25,
        unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        category: 'missions',
        rarity: 'common'
      },
      {
        id: 'week_warrior',
        name: 'Guerrero Semanal',
        description: 'Mantén una racha de 7 días',
        icon: '⚔️',
        color: 'gold',
        points: 100,
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        category: 'consistency',
        rarity: 'rare'
      }
    ],
    lastUpdated: new Date()
  },
  {
    id: '2',
    clientId: '3',
    totalPoints: 890,
    currentLevel: 6,
    pointsToNextLevel: 110,
    weeklyPoints: 180,
    monthlyPoints: 620,
    streak: {
      current: 8,
      longest: 15,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    achievements: [
      {
        id: 'first_mission',
        name: 'Primera Misión',
        description: 'Completa tu primera misión',
        icon: '🎯',
        color: 'blue',
        points: 25,
        unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        category: 'missions',
        rarity: 'common'
      }
    ],
    lastUpdated: new Date()
  }
];

export const mockPointsTransactions: PointsTransaction[] = [
  {
    id: '1',
    clientId: '2',
    type: 'earned',
    points: 150,
    reason: 'Misión completada: Racha de 7 días',
    relatedId: '3',
    relatedType: 'mission',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    description: 'Completaste exitosamente la misión de mantener una racha de 7 días'
  },
  {
    id: '2',
    clientId: '2',
    type: 'earned',
    points: 50,
    reason: 'Entrenamiento completado',
    relatedId: '1',
    relatedType: 'workout',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    description: 'Completaste tu rutina de fuerza'
  },
  {
    id: '3',
    clientId: '2',
    type: 'bonus',
    points: 25,
    reason: 'Bonus por consistencia',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    description: 'Bonus por mantener tu racha activa'
  }
];

export const mockRewards: Reward[] = [
  {
    id: '1',
    trainerId: '1',
    name: 'Sesión de Masaje Deportivo',
    description: 'Una sesión de 60 minutos de masaje deportivo para recuperación muscular',
    cost: 500,
    type: 'experience',
    category: 'training',
    icon: '💆‍♀️',
    color: 'purple',
    isActive: true,
    stock: 5,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    trainerId: '1',
    name: 'Botella de Proteína Premium',
    description: 'Proteína whey de alta calidad, sabor chocolate (1kg)',
    cost: 300,
    type: 'physical',
    category: 'nutrition',
    icon: '🥤',
    color: 'brown',
    isActive: true,
    stock: 10,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    trainerId: '1',
    name: 'Camiseta FitPro',
    description: 'Camiseta oficial de entrenamiento FitPro, material transpirable',
    cost: 200,
    type: 'physical',
    category: 'gear',
    icon: '👕',
    color: 'blue',
    isActive: true,
    stock: 15,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '4',
    trainerId: '1',
    name: 'Día Libre de Entrenamiento',
    description: 'Un día libre sin penalizaciones en tu plan de entrenamiento',
    cost: 150,
    type: 'privilege',
    category: 'training',
    icon: '🏖️',
    color: 'yellow',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '5',
    trainerId: '1',
    name: 'Plan Nutricional Personalizado',
    description: 'Plan de alimentación personalizado por 1 mes',
    cost: 400,
    type: 'digital',
    category: 'nutrition',
    icon: '📋',
    color: 'green',
    isActive: true,
    restrictions: {
      minLevel: 5
    },
    createdAt: new Date('2024-01-01')
  }
];

export const mockRewardClaims: RewardClaim[] = [
  {
    id: '1',
    clientId: '2',
    rewardId: '3',
    pointsSpent: 200,
    status: 'delivered',
    claimedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notes: 'Entregada en el gimnasio'
  }
];

export const mockLeaderboard: Leaderboard[] = [
  {
    id: '1',
    type: 'weekly',
    period: '2024-W12',
    rankings: [
      {
        clientId: '2',
        clientName: 'Ana García',
        clientAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
        points: 275,
        rank: 1,
        change: 0,
        badges: ['🔥', '💪']
      },
      {
        clientId: '3',
        clientName: 'Miguel Rodríguez',
        clientAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
        points: 180,
        rank: 2,
        change: 1,
        badges: ['🎯']
      }
    ],
    lastUpdated: new Date()
  }
];

// Función para actualizar el estado de los mensajes
export const updateMessageReadStatus = (messageId: string, read: boolean) => {
  const messageIndex = mockMessages.findIndex(msg => msg.id === messageId);
  if (messageIndex !== -1) {
    mockMessages[messageIndex] = { ...mockMessages[messageIndex], read };
    
    // Disparar evento para notificar cambios
    window.dispatchEvent(new CustomEvent('messagesUpdated'));
  }
};

// Función para agregar nuevos mensajes
export const addNewMessage = (message: Omit<Message, 'id'>) => {
  const newMessage: Message = {
    ...message,
    id: Date.now().toString()
  };
  mockMessages.push(newMessage);
  
  // Disparar evento para notificar cambios
  window.dispatchEvent(new CustomEvent('messagesUpdated'));
  
  return newMessage;
};

// Función para marcar todos los mensajes de un contacto como leídos
export const markContactMessagesAsRead = (contactId: string, userId: string) => {
  let hasChanges = false;
  
  mockMessages.forEach((msg, index) => {
    if (msg.fromId === contactId && msg.toId === userId && !msg.read) {
      mockMessages[index] = { ...msg, read: true };
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    // Disparar evento para notificar cambios
    window.dispatchEvent(new CustomEvent('messagesUpdated'));
  }
  
  return hasChanges;
};