import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  Activity, 
  Apple, 
  MessageSquare, 
  FileText,
  TrendingUp,
  Dumbbell,
  User,
  BarChart3
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const trainerNavItems = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clientes' },
  { to: '/calendar', icon: Calendar, label: 'Calendario' },
  { to: '/workouts', icon: Dumbbell, label: 'Rutinas' },
  { to: '/diet', icon: Apple, label: 'Dietas' },
  { to: '/messages', icon: MessageSquare, label: 'Mensajes' },
  { to: '/reports', icon: FileText, label: 'Reportes' },
];

const clientNavItems = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/progress', icon: TrendingUp, label: 'Mi Progreso' },
  { to: '/workouts', icon: Dumbbell, label: 'Mis Rutinas' },
  { to: '/diet', icon: Apple, label: 'Mi Dieta' },
  { to: '/calendar', icon: Calendar, label: 'Calendario' },
  { to: '/messages', icon: MessageSquare, label: 'Mensajes' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export function Sidebar() {
  const { user } = useAuth();
  const navItems = user?.role === 'trainer' ? trainerNavItems : clientNavItems;

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-gray-50 pt-5 pb-4 overflow-y-auto border-r border-gray-200">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-5 w-5"
                    aria-hidden="true"
                  />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="px-4 py-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              {user?.role === 'trainer' ? 'Entrenador' : 'Cliente'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}