import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '../types';
import { mockNotifications } from '../data/mockData';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  deleteNotification: (notificationId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      // Filtrar notificaciones del usuario actual
      const userNotifications = mockNotifications.filter(n => n.userId === user.id);
      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}