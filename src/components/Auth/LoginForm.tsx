import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Dumbbell } from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { RoleSelectionModal } from './RoleSelectionModal';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [googleUserInfo, setGoogleUserInfo] = useState<any>(null);
  const { login, loginWithGoogle, isLoading } = useAuth();

  useEffect(() => {
    // Load Google Identity Services
    const loadGoogleScript = () => {
      if (window.google) {
        setIsGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setIsGoogleLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Google Identity Services');
        setIsGoogleLoaded(true); // Set to true to show fallback
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Credenciales incorrectas. Intenta nuevamente.');
    }
  };

  const handleGoogleSuccess = async (googleUser: any) => {
    try {
      const success = await loginWithGoogle(googleUser);
      if (!success) {
        // New user, show role selection
        setGoogleUserInfo(googleUser);
        setShowRoleModal(true);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Error al iniciar sesión con Google. Intenta nuevamente.');
    }
  };

  const handleGoogleError = (error: any) => {
    console.error('Google sign-in error:', error);
    setError('Error al iniciar sesión con Google. Intenta nuevamente.');
  };

  const handleRoleSelection = async (role: 'trainer' | 'client', additionalInfo?: any) => {
    if (!googleUserInfo) return;

    const success = await loginWithGoogle(googleUserInfo, role, additionalInfo);
    if (success) {
      setShowRoleModal(false);
      setGoogleUserInfo(null);
    } else {
      setError('Error al completar el registro. Intenta nuevamente.');
    }
  };

  const handleDemoLogin = (userType: 'trainer' | 'client') => {
    if (userType === 'trainer') {
      setEmail('trainer@fitpro.com');
    } else {
      setEmail('ana@cliente.com');
    }
    setPassword('password123');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">FitTrainer Pro</h2>
            <p className="mt-2 text-sm text-gray-600">
              Gestión profesional de entrenamiento
            </p>
          </div>

          {/* Google Sign In */}
          <div className="space-y-4">
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              disabled={!isGoogleLoaded}
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con email</span>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Cuentas de demostración</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('trainer')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Entrenador
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('client')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cliente
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setGoogleUserInfo(null);
        }}
        onRoleSelect={handleRoleSelection}
        userInfo={googleUserInfo || { name: '', email: '', picture: '' }}
      />
    </>
  );
}