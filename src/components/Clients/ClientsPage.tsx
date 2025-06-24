import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockClients } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Filter,
  Mail,
  Phone,
  Calendar,
  Activity
} from 'lucide-react';
import { AddClientModal } from './AddClientModal';

export function ClientsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const clients = mockClients.filter(client => {
    const matchesTrainer = client.trainerId === user?.id;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'all' || client.gender === filterGender;
    
    return matchesTrainer && matchesSearch && matchesGender;
  });

  const handleAddClient = (clientData: any) => {
    console.log('Adding new client:', clientData);
    // Here you would typically save to your backend/database
    // For now, we'll just log it
    alert('Cliente agregado exitosamente (funcionalidad de demostración)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Clientes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona la información de tus {clients.length} clientes
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Cliente
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value as 'all' | 'male' | 'female')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos</option>
                <option value="male">Hombres</option>
                <option value="female">Mujeres</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Link key={client.id} to={`/clients/${client.id}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0">
                  {client.avatar ? (
                    <img 
                      src={client.avatar} 
                      alt={client.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Edad:</span>
                  <span className="text-sm font-medium text-gray-900">{client.age} años</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Peso:</span>
                  <span className="text-sm font-medium text-gray-900">{client.currentWeight} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Altura:</span>
                  <span className="text-sm font-medium text-gray-900">{client.height} cm</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Activo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Desde {new Date(client.createdAt).getMonth() + 1}/{new Date(client.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Objetivos principales */}
              {client.goals.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Objetivos principales:</p>
                  <div className="flex flex-wrap gap-1">
                    {client.goals.slice(0, 2).map((goal, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {goal}
                      </span>
                    ))}
                    {client.goals.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{client.goals.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron clientes</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterGender !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer cliente'
            }
          </p>
        </div>
      )}

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddClient}
      />
    </div>
  );
}