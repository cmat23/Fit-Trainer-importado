import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface GoogleSignInButtonProps {
  onSuccess: (user: any) => void;
  onError?: (error: any) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  disabled?: boolean;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'signin_with',
  theme = 'outline',
  size = 'large',
  shape = 'rectangular',
  disabled = false
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);

  // Check if we have a valid Google Client ID
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isValidClientId = clientId && 
    clientId !== '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com' &&
    clientId.includes('.apps.googleusercontent.com');

  useEffect(() => {
    if (!isValidClientId) {
      setError('Google OAuth no está configurado');
      return;
    }

    const loadGoogleScript = () => {
      if (window.google) {
        setIsGoogleLoaded(true);
        initializeButton();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleLoaded(true);
        setTimeout(() => {
          initializeButton();
        }, 100);
      };
      script.onerror = () => {
        setError('Error al cargar Google Sign-In');
        onError?.('Failed to load Google Sign-In script');
      };
      document.head.appendChild(script);
    };

    const initializeButton = () => {
      if (!window.google || !buttonRef.current || disabled) return;

      try {
        const handleCredentialResponse = (response: any) => {
          try {
            // Decode JWT token (in production, verify this server-side)
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            const googleUser = {
              id: payload.sub,
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
              given_name: payload.given_name,
              family_name: payload.family_name,
            };

            onSuccess(googleUser);
          } catch (error) {
            console.error('Error processing Google credential:', error);
            setError('Error al procesar las credenciales de Google');
            onError?.(error);
          }
        };

        // Initialize Google Auth for this button
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false
        });

        // Clear any previous content
        if (buttonRef.current) {
          buttonRef.current.innerHTML = '';
        }

        // Render the button
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme,
          size,
          type: 'standard',
          text,
          shape,
          logo_alignment: 'left',
          width: buttonRef.current?.offsetWidth || 300,
        });

        setError(null);
      } catch (error) {
        console.error('Error initializing Google button:', error);
        setError('Error al inicializar Google Sign-In');
        onError?.(error);
      }
    };

    if (!disabled) {
      loadGoogleScript();
    }
  }, [onSuccess, onError, text, theme, size, shape, disabled, clientId, isValidClientId]);

  if (disabled) {
    return (
      <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Cargando Google Sign-In...</span>
      </div>
    );
  }

  if (!isValidClientId || error) {
    return (
      <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-amber-800 mb-1">
              Google OAuth no configurado
            </h4>
            <p className="text-sm text-amber-700 mb-3">
              Para usar Google Sign-In necesitas configurar las credenciales OAuth.
            </p>
            
            <button
              onClick={() => setShowSetupInstructions(!showSetupInstructions)}
              className="text-sm text-amber-800 hover:text-amber-900 underline font-medium"
            >
              {showSetupInstructions ? 'Ocultar' : 'Ver'} instrucciones de configuración
            </button>

            {showSetupInstructions && (
              <div className="mt-3 p-3 bg-amber-100 rounded-lg">
                <h5 className="text-sm font-medium text-amber-900 mb-2">
                  Pasos para configurar Google OAuth:
                </h5>
                <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                  <li>
                    Ve a{' '}
                    <a 
                      href="https://console.developers.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-amber-900"
                    >
                      Google Cloud Console
                    </a>
                  </li>
                  <li>Crea un proyecto o selecciona uno existente</li>
                  <li>Habilita la API de Google Identity</li>
                  <li>Crea credenciales OAuth 2.0 Client ID</li>
                  <li>Agrega estos orígenes autorizados:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• <code className="bg-amber-200 px-1 rounded">http://localhost:5173</code> (desarrollo)</li>
                      <li>• Tu dominio de producción</li>
                    </ul>
                  </li>
                  <li>Copia el Client ID al archivo <code className="bg-amber-200 px-1 rounded">.env</code></li>
                </ol>
                
                <div className="mt-3 p-2 bg-amber-200 rounded text-xs text-amber-900">
                  <strong>Archivo .env:</strong><br/>
                  <code>VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com</code>
                </div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-amber-300">
              <p className="text-xs text-amber-700">
                <strong>Mientras tanto:</strong> Puedes usar las cuentas de demostración con email y contraseña.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isGoogleLoaded) {
    return (
      <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
        <span className="text-gray-500">Cargando Google Sign-In...</span>
      </div>
    );
  }

  return <div ref={buttonRef} className="w-full" />;
}