import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Smartphone, 
  Watch, 
  Activity, 
  Heart, 
  Moon, 
  Footprints,
  Flame,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle,
  Settings,
  Download,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DeviceConnection {
  id: string;
  deviceType: string;
  deviceName: string;
  isConnected: boolean;
  lastSync: Date;
  permissions: string[];
}

interface FitnessData {
  steps: number;
  calories: number;
  activeMinutes: number;
  distance: number;
  heartRate?: number;
  sleepHours?: number;
  workouts: Array<{
    type: string;
    duration: number;
    calories: number;
    startTime: Date;
  }>;
}

export function SmartwatchSync() {
  const { user } = useAuth();
  const [connectedDevices, setConnectedDevices] = useState<DeviceConnection[]>([]);
  const [todayData, setTodayData] = useState<FitnessData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  // Dispositivos disponibles para conectar
  const availableDevices = [
    {
      id: 'apple_health',
      name: 'Apple Health',
      icon: '🍎',
      description: 'Sincroniza datos de Apple Watch y iPhone'
    },
    {
      id: 'google_fit',
      name: 'Google Fit',
      icon: '🏃',
      description: 'Conecta con Wear OS y Android'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: '⌚',
      description: 'Dispositivos Fitbit Versa, Sense, Charge'
    },
    {
      id: 'garmin',
      name: 'Garmin Connect',
      icon: '🏔️',
      description: 'Relojes deportivos Garmin'
    },
    {
      id: 'samsung_health',
      name: 'Samsung Health',
      icon: '📱',
      description: 'Galaxy Watch y Samsung Health'
    }
  ];

  useEffect(() => {
    loadConnectedDevices();
    loadTodayData();
  }, []);

  const loadConnectedDevices = () => {
    // Simular dispositivos conectados
    const mockDevices: DeviceConnection[] = [
      {
        id: '1',
        deviceType: 'apple_health',
        deviceName: 'Apple Watch Series 8',
        isConnected: true,
        lastSync: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        permissions: ['steps', 'heart_rate', 'workouts', 'sleep']
      },
      {
        id: '2',
        deviceType: 'google_fit',
        deviceName: 'Google Fit',
        isConnected: false,
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        permissions: ['steps', 'calories']
      }
    ];
    setConnectedDevices(mockDevices);
  };

  const loadTodayData = () => {
    // Simular datos del día actual
    const mockData: FitnessData = {
      steps: 8547,
      calories: 2340,
      activeMinutes: 67,
      distance: 6.2,
      heartRate: 72,
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
      ]
    };
    setTodayData(mockData);
  };

  const handleSync = async (deviceId: string) => {
    setIsLoading(true);
    
    // Simular sincronización
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Actualizar última sincronización
    setConnectedDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, lastSync: new Date() }
          : device
      )
    );
    
    // Recargar datos
    loadTodayData();
    setIsLoading(false);
    
    alert('Datos sincronizados exitosamente');
  };

  const handleConnectDevice = async () => {
    if (!selectedDevice) return;
    
    setIsLoading(true);
    
    // Simular conexión de dispositivo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const deviceInfo = availableDevices.find(d => d.id === selectedDevice);
    if (deviceInfo) {
      const newDevice: DeviceConnection = {
        id: Date.now().toString(),
        deviceType: selectedDevice,
        deviceName: deviceInfo.name,
        isConnected: true,
        lastSync: new Date(),
        permissions: ['steps', 'calories', 'heart_rate', 'workouts']
      };
      
      setConnectedDevices(prev => [...prev, newDevice]);
    }
    
    setIsLoading(false);
    setShowConnectModal(false);
    setSelectedDevice('');
    
    alert('Dispositivo conectado exitosamente');
  };

  const handleDisconnectDevice = (deviceId: string) => {
    if (window.confirm('¿Estás seguro de que quieres desconectar este dispositivo?')) {
      setConnectedDevices(prev => 
        prev.map(device => 
          device.id === deviceId 
            ? { ...device, isConnected: false }
            : device
        )
      );
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    const device = availableDevices.find(d => d.id === deviceType);
    return device?.icon || '⌚';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sincronización de Dispositivos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Conecta tus dispositivos wearables para sincronizar automáticamente tus datos de actividad
          </p>
        </div>
        <button 
          onClick={() => setShowConnectModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Conectar Dispositivo
        </button>
      </div>

      {/* Datos de hoy */}
      {todayData && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Actividad de Hoy</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(), 'dd MMM yyyy', { locale: es })}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Footprints className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{todayData.steps.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Pasos</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{todayData.calories}</p>
              <p className="text-sm text-gray-600">Calorías</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{todayData.activeMinutes}</p>
              <p className="text-sm text-gray-600">Min Activos</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{todayData.distance}</p>
              <p className="text-sm text-gray-600">km</p>
            </div>
          </div>

          {/* Datos adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {todayData.heartRate && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <Heart className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Frecuencia Cardíaca</p>
                  <p className="text-lg font-bold text-red-600">{todayData.heartRate} bpm</p>
                </div>
              </div>
            )}

            {todayData.sleepHours && (
              <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                <Moon className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Horas de Sueño</p>
                  <p className="text-lg font-bold text-indigo-600">{todayData.sleepHours}h</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Activity className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Entrenamientos</p>
                <p className="text-lg font-bold text-yellow-600">{todayData.workouts.length}</p>
              </div>
            </div>
          </div>

          {/* Lista de entrenamientos */}
          {todayData.workouts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Entrenamientos de Hoy</h3>
              <div className="space-y-2">
                {todayData.workouts.map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{workout.type}</p>
                      <p className="text-sm text-gray-600">
                        {format(workout.startTime, 'HH:mm', { locale: es })} • {workout.duration} min
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-orange-600">{workout.calories} cal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dispositivos conectados */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dispositivos Conectados</h2>
        
        <div className="space-y-4">
          {connectedDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{getDeviceIcon(device.deviceType)}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{device.deviceName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {device.isConnected ? (
                      <>
                        <Wifi className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Conectado</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">Desconectado</span>
                      </>
                    )}
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      Última sync: {format(device.lastSync, 'dd/MM HH:mm', { locale: es })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {device.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {device.isConnected && (
                  <button
                    onClick={() => handleSync(device.id)}
                    disabled={isLoading}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
                    title="Sincronizar ahora"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                )}
                
                <button
                  onClick={() => alert('Configuración del dispositivo (funcionalidad de demostración)')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-full transition-colors"
                  title="Configurar dispositivo"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {device.isConnected ? (
                  <button
                    onClick={() => handleDisconnectDevice(device.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Desconectar
                  </button>
                ) : (
                  <button
                    onClick={() => handleSync(device.id)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Reconectar
                  </button>
                )}
              </div>
            </div>
          ))}

          {connectedDevices.length === 0 && (
            <div className="text-center py-8">
              <Watch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay dispositivos conectados</h3>
              <p className="mt-1 text-sm text-gray-500">
                Conecta tu smartwatch o app de fitness para sincronizar automáticamente tus datos
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para conectar dispositivo */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Conectar Dispositivo</h2>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Selecciona el dispositivo o aplicación que quieres conectar:
              </p>

              <div className="space-y-3">
                {availableDevices.map((device) => (
                  <label
                    key={device.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDevice === device.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="device"
                      value={device.id}
                      checked={selectedDevice === device.id}
                      onChange={(e) => setSelectedDevice(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-2xl mr-3">{device.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{device.name}</h3>
                      <p className="text-sm text-gray-600">{device.description}</p>
                    </div>
                    {selectedDevice === device.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </label>
                ))}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConnectDevice}
                  disabled={!selectedDevice || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Conectando...' : 'Conectar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}