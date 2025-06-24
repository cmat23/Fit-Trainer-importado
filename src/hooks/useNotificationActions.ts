import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

export function useNotificationActions() {
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const notifyWorkoutCompleted = (clientName: string, workoutName: string, clientId: string) => {
    if (user?.role === 'trainer') {
      addNotification({
        userId: user.id,
        type: 'workout',
        title: 'Entrenamiento completado',
        message: `${clientName} completó "${workoutName}"`,
        read: false,
        actionUrl: `/clients/${clientId}`,
        priority: 'low',
        relatedId: clientId
      });
    }
  };

  const notifyNewMessage = (fromName: string, fromId: string, toId: string) => {
    addNotification({
      userId: toId,
      type: 'message',
      title: 'Nuevo mensaje',
      message: `${fromName} te ha enviado un mensaje`,
      read: false,
      actionUrl: '/messages',
      priority: 'medium',
      relatedId: fromId
    });
  };

  const notifyAppointmentReminder = (clientName: string, time: string, appointmentId: string) => {
    if (user?.role === 'trainer') {
      addNotification({
        userId: user.id,
        type: 'appointment',
        title: 'Recordatorio de cita',
        message: `Tienes una cita con ${clientName} a las ${time}`,
        read: false,
        actionUrl: '/calendar',
        priority: 'high',
        relatedId: appointmentId
      });
    }
  };

  const notifyProgressUpdate = (clientName: string, clientId: string) => {
    if (user?.role === 'trainer') {
      addNotification({
        userId: user.id,
        type: 'progress',
        title: 'Nuevo progreso registrado',
        message: `${clientName} ha registrado nuevas mediciones`,
        read: false,
        actionUrl: `/clients/${clientId}`,
        priority: 'low',
        relatedId: clientId
      });
    }
  };

  const notifyNewWorkoutAssigned = (trainerName: string, workoutName: string, clientId: string) => {
    addNotification({
      userId: clientId,
      type: 'workout',
      title: 'Nueva rutina asignada',
      message: `${trainerName} te ha asignado "${workoutName}"`,
      read: false,
      actionUrl: '/workouts',
      priority: 'medium',
      relatedId: workoutName
    });
  };

  return {
    notifyWorkoutCompleted,
    notifyNewMessage,
    notifyAppointmentReminder,
    notifyProgressUpdate,
    notifyNewWorkoutAssigned
  };
}