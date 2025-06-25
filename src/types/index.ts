export interface User {
  id: string;
  email: string;
  name: string;
  role: 'trainer' | 'client';
  trainerId?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  currentWeight: number;
  avatar?: string;
  trainerId: string;
  createdAt: Date;
  goals: string[];
  notes: string;
}

export interface ProgressEntry {
  id: string;
  clientId: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  bmi?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string[];
  targetMuscles: string[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: number;
  duration?: number;
  rest?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  clientId: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  completed: boolean;
  duration?: number;
  notes?: string;
  feeling?: 1 | 2 | 3 | 4 | 5;
  energy?: 1 | 2 | 3 | 4 | 5;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description?: string;
  time?: string;
}

export interface DietPlan {
  id: string;
  clientId: string;
  trainerId: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
  };
  notes?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  trainerId: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  type: 'personal' | 'group' | 'consultation';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'appointment' | 'workout' | 'progress' | 'system' | 'mission';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  relatedId?: string;
}

// Nuevos tipos para integración con smartwatches
export interface FitnessData {
  id: string;
  clientId: string;
  date: Date;
  source: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'samsung_health' | 'manual';
  dataType: 'steps' | 'calories' | 'heart_rate' | 'sleep' | 'workout' | 'distance' | 'active_minutes';
  value: number;
  unit: string;
  metadata?: {
    workoutType?: string;
    duration?: number;
    averageHeartRate?: number;
    maxHeartRate?: number;
    sleepStages?: {
      deep: number;
      light: number;
      rem: number;
      awake: number;
    };
  };
  syncedAt: Date;
}

export interface DeviceConnection {
  id: string;
  clientId: string;
  deviceType: 'apple_watch' | 'fitbit' | 'garmin' | 'samsung_watch' | 'google_fit' | 'other';
  deviceName: string;
  isConnected: boolean;
  lastSync: Date;
  permissions: string[];
  createdAt: Date;
}

export interface DailyActivity {
  id: string;
  clientId: string;
  date: Date;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  distance: number; // en km
  averageHeartRate?: number;
  sleepHours?: number;
  workouts: {
    type: string;
    duration: number;
    calories: number;
    startTime: Date;
  }[];
  source: string;
  syncedAt: Date;
}

// Nuevos tipos para el sistema de incentivos y misiones
export interface Mission {
  id: string;
  trainerId: string;
  clientId: string;
  title: string;
  description: string;
  type: 'workout' | 'steps' | 'calories' | 'weight' | 'consistency' | 'custom';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  points: number;
  target: {
    value: number;
    unit: string;
    timeframe: 'daily' | 'weekly' | 'monthly' | 'total';
  };
  status: 'active' | 'completed' | 'expired' | 'paused';
  progress: number; // 0-100
  startDate: Date;
  endDate: Date;
  completedAt?: Date;
  category: 'fitness' | 'nutrition' | 'lifestyle' | 'challenge';
  icon: string;
  color: string;
  requirements?: {
    workoutType?: string;
    exerciseId?: string;
    minDuration?: number;
    specificDays?: string[];
  };
  createdAt: Date;
}

export interface ClientPoints {
  id: string;
  clientId: string;
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
  weeklyPoints: number;
  monthlyPoints: number;
  streak: {
    current: number;
    longest: number;
    lastActivity: Date;
  };
  achievements: Achievement[];
  lastUpdated: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  points: number;
  unlockedAt: Date;
  category: 'missions' | 'consistency' | 'milestones' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PointsTransaction {
  id: string;
  clientId: string;
  type: 'earned' | 'bonus' | 'penalty' | 'reward';
  points: number;
  reason: string;
  relatedId?: string; // ID de misión, workout, etc.
  relatedType?: 'mission' | 'workout' | 'achievement' | 'bonus';
  timestamp: Date;
  description: string;
}

export interface Reward {
  id: string;
  trainerId: string;
  name: string;
  description: string;
  cost: number; // puntos necesarios
  type: 'physical' | 'digital' | 'experience' | 'privilege';
  category: 'gear' | 'nutrition' | 'training' | 'lifestyle';
  icon: string;
  color: string;
  isActive: boolean;
  stock?: number;
  restrictions?: {
    minLevel?: number;
    requiredAchievements?: string[];
    timeLimit?: Date;
  };
  createdAt: Date;
}

export interface RewardClaim {
  id: string;
  clientId: string;
  rewardId: string;
  pointsSpent: number;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  claimedAt: Date;
  deliveredAt?: Date;
  notes?: string;
}

export interface Leaderboard {
  id: string;
  type: 'weekly' | 'monthly' | 'alltime';
  period: string; // "2024-03" para monthly, "2024-W12" para weekly
  rankings: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  points: number;
  rank: number;
  change: number; // cambio desde la última actualización
  badges: string[]; // logros destacados
}