import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  MessageSquare, 
  Calendar, 
  Dumbbell, 
  TrendingUp, 
  Settings,
  Check,
  CheckCheck,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export function NotificationDropdown({ isOpen, onClose, buttonRef }: NotificationDropdownProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'workout':
        return <Dumbbell className="w-4 h-4 text-green-600" />;
      case 'progress':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      default:
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    markAsRead(notificationId);
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                title="Marcar todas como leídas"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(notification.timestamp, { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                            className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Marcar como leída"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar notificación"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="absolute right-2 top-4">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay notificaciones</h3>
            <p className="mt-1 text-sm text-gray-500">
              Te notificaremos cuando tengas nuevas actualizaciones
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              // Aquí podrías navegar a una página de todas las notificaciones
              onClose();
            }}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Ver todas las notificaciones
          </button>
        </div>
      )}
    </div>
  );
}