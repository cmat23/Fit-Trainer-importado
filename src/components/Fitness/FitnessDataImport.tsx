import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Activity,
  Heart,
  Footprints,
  Flame,
  Clock,
  Moon
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ImportedData {
  date: Date;
  steps?: number;
  calories?: number;
  heartRate?: number;
  sleepHours?: number;
  activeMinutes?: number;
  distance?: number;
  workouts?: Array<{
    type: string;
    duration: number;
    calories: number;
  }>;
}

export function FitnessDataImport() {
  const { user } = useAuth();
  const [importedData, setImportedData] = useState<ImportedData[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('idle');

    try {
      // Simular procesamiento del archivo
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular datos importados
      const mockImportedData: ImportedData[] = [
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          steps: 12450,
          calories: 2680,
          heartRate: 75,
          sleepHours: 8.2,
          activeMinutes: 89,
          distance: 8.7,
          workouts: [
            { type: 'Correr', duration: 45, calories: 420 },
            { type: 'Yoga', duration: 30, calories: 120 }
          ]
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          steps: 9876,
          calories: 2340,
          heartRate: 72,
          sleepHours: 7.5,
          activeMinutes: 67,
          distance: 6.2,
          workouts: [
            { type: 'Entrenamiento de fuerza', duration: 60, calories: 280 }
          ]
        },
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          steps: 15230,
          calories: 2890,
          heartRate: 78,
          sleepHours: 6.8,
          activeMinutes: 102,
          distance: 11.4,
          workouts: [
            { type: 'Ciclismo', duration: 90, calories: 650 },
            { type: 'Natación', duration: 30, calories: 200 }
          ]
        }
      ];

      setImportedData(mockImportedData);
      setImportStatus('success');
    } catch (error) {
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveData = async () => {
    setIsImporting(true);
    
    // Simular guardado de datos
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Datos guardados exitosamente en tu perfil');
    setImportedData([]);
    setImportStatus('idle');
    setIsImporting(false);
  };

  const downloadTemplate = () => {
    // Crear un CSV de ejemplo
    const csvContent = `Fecha,Pasos,Calorias,Frecuencia_Cardiaca,Horas_Sueno,Minutos_Activos,Distancia_km,Tipo_Ejercicio,Duracion_min,Calorias_Ejercicio
2024-03-20,12450,2680,75,8.2,89,8.7,Correr,45,420
2024-03-19,9876,2340,72,7.5,67,6.2,Fuerza,60,280
2024-03-18,15230,2890,78,6.8,102,11.4,Ciclismo,90,650`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-datos-fitness.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Importar Datos de Fitness</h1>
        <p className="mt-1 text-sm text-gray-600">
          Importa datos desde archivos CSV o exportaciones de otras aplicaciones de fitness
        </p>
      </div>

      {/* Área de carga */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cargar Archivo de Datos</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Arrastra un archivo aquí o haz clic para seleccionar
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Formatos soportados: CSV, JSON, XML (máx. 10MB)
              </span>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept=".csv,.json,.xml"
              onChange={handleFileUpload}
              disabled={isImporting}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Plantilla CSV
          </button>

          {importStatus === 'success' && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Archivo procesado correctamente</span>
            </div>
          )}

          {importStatus === 'error' && (
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Error al procesar el archivo</span>
            </div>
          )}
        </div>
      </div>

      {/* Formatos soportados */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-md font-semibold text-blue-900 mb-3">Formatos de Datos Soportados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Aplicaciones Compatibles:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Apple Health (exportación XML)</li>
              <li>• Google Fit (exportación JSON)</li>
              <li>• Fitbit (datos CSV)</li>
              <li>• Garmin Connect (exportación CSV)</li>
              <li>• Samsung Health (datos CSV)</li>
              <li>• Strava (exportación GPX/CSV)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Datos que Puedes Importar:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Pasos diarios y distancia</li>
              <li>• Calorías quemadas</li>
              <li>• Frecuencia cardíaca</li>
              <li>• Horas de sueño</li>
              <li>• Minutos activos</li>
              <li>• Entrenamientos y ejercicios</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Vista previa de datos importados */}
      {importedData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Vista Previa de Datos Importados</h2>
            <span className="text-sm text-gray-500">{importedData.length} días de datos</span>
          </div>

          <div className="space-y-4">
            {importedData.map((data, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {format(data.date, 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {data.steps && (
                    <div className="flex items-center space-x-2">
                      <Footprints className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{data.steps.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Pasos</p>
                      </div>
                    </div>
                  )}

                  {data.calories && (
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{data.calories}</p>
                        <p className="text-xs text-gray-500">Calorías</p>
                      </div>
                    </div>
                  )}

                  {data.heartRate && (
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{data.heartRate} bpm</p>
                        <p className="text-xs text-gray-500">FC Promedio</p>
                      </div>
                    </div>
                  )}

                  {data.sleepHours && (
                    <div className="flex items-center space-x-2">
                      <Moon className="w-4 h-4 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{data.sleepHours}h</p>
                        <p className="text-xs text-gray-500">Sueño</p>
                      </div>
                    </div>
                  )}

                  {data.activeMinutes && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{data.activeMinutes}</p>
                        <p className="text-xs text-gray-500">Min Activos</p>
                      </div>
                    </div>
                  )}

                  {data.distance && (
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{data.distance} km</p>
                        <p className="text-xs text-gray-500">Distancia</p>
                      </div>
                    </div>
                  )}
                </div>

                {data.workouts && data.workouts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Entrenamientos:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.workouts.map((workout, workoutIndex) => (
                        <span
                          key={workoutIndex}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {workout.type} ({workout.duration}min, {workout.calories}cal)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setImportedData([]);
                setImportStatus('idle');
              }}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveData}
              disabled={isImporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isImporting ? 'Guardando...' : 'Guardar Datos'}
            </button>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-md font-semibold text-gray-900 mb-3">Cómo Exportar Datos desde Otras Apps</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-gray-900">Apple Health:</h4>
            <p>Configuración → Privacidad y seguridad → Salud → Exportar todos los datos de salud</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Google Fit:</h4>
            <p>Google Takeout → Seleccionar Fit → Descargar datos en formato JSON</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Fitbit:</h4>
            <p>Configuración de cuenta → Exportar datos → Solicitar archivo de datos</p>
          </div>
        </div>
      </div>
    </div>
  );
}