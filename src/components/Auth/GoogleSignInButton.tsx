import React, { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
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
        // Wait a bit for Google to fully initialize
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

        // Use a test client ID for development
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
          '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';

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
  }, [onSuccess, onError, text, theme, size, shape, disabled]);

  if (disabled) {
    return (
      <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Cargando Google Sign-In...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-yellow-800 mb-2">{error}</p>
          <p className="text-xs text-yellow-600">
            Para usar Google Sign-In en producción, configura las credenciales OAuth en Google Cloud Console
          </p>
        </div>
      </div>
    );
  }

  if (!isGoogleLoaded) {
    return (
      <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
        <span className="text-gray-500">Cargando...</span>
      </div>
    );
  }

  return <div ref={buttonRef} className="w-full" />;
}