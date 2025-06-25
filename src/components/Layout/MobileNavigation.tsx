import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  Apple, 
  MessageSquare, 
  BarChart3,
  TrendingUp,
  Dumbbell,
  User,
  Smartphone
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const trainerNavItems = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clientes' },
  { to: '/workouts', icon: Dumbbell, label: 'Rutinas' },
  { to: '/messages', icon: MessageSquare, label: 'Chat' },
];

const clientNavItems = [
  { to: '/dashboard', icon: BarChart3, label: 'Inicio' },
  { to: '/progress', icon: TrendingUp, label: 'Progreso' },
  { to: '/workouts', icon: Dumbbell, label: 'Rutinas' },
  { to: '/fitness-sync', icon: Smartphone, label: 'Sync' },
];

export function MobileNavigation() {
  const { user } = useAuth();
  const navItems = user?.role === 'trainer' ? trainerNavItems : clientNavItems;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}